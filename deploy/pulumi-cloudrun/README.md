# Cloud Run with https

- We want a recipe to deploy a Cloud Run service, with a managed SSL cert.
- Stretch goal, get a postgres (CloudSQL or AlloyDB)

## Compute (Container)

The compute will be on Cloud Run.

Unfortunately becaause of geo-restrictions Domain mapping for Cloud Run is not an option for Canada.

In addition to the Cloud Run service, we therefore need to:

- Create a Managed SSL Certificate for the domain
- Create a Backend Service. Note that the protocol is "HTTP2" for Cloud Run services.
- Add the Cloud Run service as a backend to the Backend Service.
- Create a URL Map to route traffic to the Backend Service using the Managed SSL Certificate.
- Create/Lookup a Managed DNS Zone
- Create an A record for your domain

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
<space>export PULUMI_CONFIG_PASSPHRASE="your stack passhrase"
pulumi up
```
