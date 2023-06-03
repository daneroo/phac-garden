# Cloud Run with https

- We want a recipe to deploy a Cloud Run service, with a managed SSL cert.
- Stretch goal, get a postgres (CloudSQL or AlloyDB)

## Compute (Container)

The compute will be on Cloud Run.

Unfortunately because of geo-restrictions Domain mapping for Cloud Run is not an option for Canada.

In addition to the Cloud Run service, we therefore need to provision:


1. `RegionNetworkEndpointGroup` (`my-neg`)
2. `BackendService` (`my-backend`)
3. `URLMap` (`my-url-map`)
4. `ManagedZone` (`dl-phac-alpha-canada-ca`)
5. `ManagedSslCertificate` (`my-certificate`)
6. `TargetHttpsProxy` (`my-https-proxy`)
7. `GlobalForwardingRule` (`my-forwarding-rule`)
8. `RecordSet` (`my-dns-record`)

### Managed certificate stack

These are the resources in the stack with details about encryption

1. **RegionNetworkEndpointGroup (`my-neg`)**:
   - Represents the Serverless Region Network Endpoint Group (NEG).
   - It acts as the target for the load balancer and handles routing traffic to the Cloud Run service.

2. **BackendService (`my-backend`)**:
   - Defines the configuration for load balancing.
   - Associated with the NEG (`my-neg`) as its backend.
   - Handles traffic between the load balancer and the Cloud Run service.

3. **URLMap (`my-url-map`)**:
   - Defines the routing rules for incoming requests.
   - Maps URL paths to the appropriate backend service.
   - No specific encryption-related functionality, but helps with request routing.

4. **ManagedZone (`dl-phac-alpha-canada-ca`)**:
   - Represents the managed DNS zone.
   - Provides the DNS configuration for your custom domain.

5. **ManagedSslCertificate (`my-certificate`)**:
   - Secures traffic between the client's browser and the load balancer.
   - Provides SSL/TLS encryption for HTTPS connections.

6. **TargetHttpsProxy (`my-https-proxy`)**:
   - Acts as an intermediary between the load balancer and the Cloud Run service.
   - Terminates SSL connections from clients and establishes an encrypted connection with the Cloud Run service.

7. **GlobalForwardingRule (`my-forwarding-rule`)**:
   - Receives incoming requests from clients and directs them to the appropriate backend service based on URL paths and other defined rules.
   - Traffic between the client and the Global Forwarding Rule is encrypted via SSL/TLS.

8. **RecordSet (`my-dns-record`)**:
   - Represents the DNS record that maps your custom domain to the IP address of the load balancer.
   - Enables clients to resolve the domain name and connect to the load balancer securely.

In summary, the traffic encryption within this setup is as follows:

- Traffic Encryption Summary:
  - Encryption between the client's browser and the load balancer is provided by the **Managed SSL Certificate** (`my-certificate`). It ensures secure communication over HTTPS.
  - Traffic between the load balancer and the Cloud Run service is encrypted within the Google Cloud network, utilizing secure internal communication mechanisms.
  
In this setup, the load balancer is not using the auto-provisioned certificate from the Cloud Run service's default URL (https://time-deno-2m3hexrmga-nn.a.run.app).

## Persistence (Database)

We are using postgres. It will be provisioned as a Managed Cloud SQL Postgrtes instance, or an [AlloyDB](https://cloud.google.com/alloydb)

## Pulumi

Select the backend and setup gcloud auth

- [ ] TODO: put the state in a bucket!

```bash
# Select the state backend (local)

# From this directory  - until we start using a GCP bucket for state
mkdir PulumiState && pulumi login "file:$PWD/PulumiState"
pulumi login file:/Users/daniel/Code/PHAC/phac-dhis2/PulumiState
# required to operate on GCP
gcloud auth application-default login

pulumi stack select gcp
pulumi config set gcp:project pdcp-cloud-009-danl
pulumi config set gcp:region us-central1
pulumi config set gcp:region "northamerica-northeast1"
<space>export PULUMI_CONFIG_PASSPHRASE="your stack passhrase"
pulumi up
```
