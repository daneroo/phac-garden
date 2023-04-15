# Managing our own personal delegated DNS Zone

We are  delegating a subdomain to our own project, so we can manage it's DNS records.

## Delegating a zone to my own project

Steps:

- Create a new zone in My project
- Add the delegate NS record in the parent zone
- Add a TXT record in the new zone to test

I added an explicit `--project` parameter to each command, to make it clear which project I was working in.
My project is referred to as `${PROJECT_ID}` in the snippets below, whereas the parent project is referred to as `${DELEGATING_PROJECT_ID}`.
The parent project is the one that is already managing the parent domain.

## Script snippets

### Create a new zone in My project

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"

# Create the new zone in my project
gcloud dns managed-zones create dl-phac-alpha-canada-ca --description="" --dnssec-state="on" --no-log-dns-queries --dns-name="dl.phac.alpha.canada.ca" --project=${PROJECT_ID}
# List it's name servers
gcloud dns managed-zones describe dl-phac-alpha-canada-ca --project=${PROJECT_ID} | grep -A5 nameServers 

nameServers:
- ns-cloud-a1.googledomains.com.
- ns-cloud-a2.googledomains.com.
- ns-cloud-a3.googledomains.com.
- ns-cloud-a4.googledomains.com.


```

### Add the delegate NS record in the parent zone - referring to the nameservers of the new zone ^

Note: the NS records are added in a transaction, and then executed. The NS entries are positional parameters to the `gcloud dns record-sets transaction add` command. (not comma separated as a single parameter)

```bash
export DELEGATING_PROJECT_ID="pdcp-serv-002-alpha-dns"
# Careful, the trailing dot is important
export NEWSUBDOMAIN="dl.phac.alpha.canada.ca."
gcloud dns record-sets transaction start --zone=phac-alpha-canada-ca --project=${DELEGATING_PROJECT_ID}
gcloud dns record-sets transaction add --zone=phac-alpha-canada-ca --name=${NEWSUBDOMAIN} --ttl=21600 --type=NS ns-cloud-a1.googledomains.com. ns-cloud-a2.googledomains.com. ns-cloud-a3.googledomains.com. ns-cloud-a4.googledomains.com. --project=${DELEGATING_PROJECT_ID}
gcloud dns record-sets transaction execute --zone=phac-alpha-canada-ca --project=${DELEGATING_PROJECT_ID}
```

### Add a test TXT record in the new zone to verify it's working

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
gcloud dns record-sets transaction start --zone=dl-phac-alpha-canada-ca --project=${PROJECT_ID}
gcloud dns record-sets transaction add --zone=dl-phac-alpha-canada-ca --name=${NEWSUBDOMAIN} --ttl=300 --type=TXT "TADA" --project=${PROJECT_ID}
gcloud dns record-sets transaction execute --zone=dl-phac-alpha-canada-ca --project=${PROJECT_ID}

$ dig +short TXT dl.phac.alpha.canada.ca
"TADA"

# or using gcloud
$ gcloud dns record-sets describe --zone=dl-phac-alpha-canada-ca --type TXT --project=${PROJECT_ID} dl.phac.alpha.canada.ca.
NAME                      TYPE  TTL  DATA
dl.phac.alpha.canada.ca.  TXT   300  "TADA"

# Now clean up
gcloud dns record-sets transaction start --zone=dl-phac-alpha-canada-ca --project=${PROJECT_ID}
gcloud dns record-sets transaction remove --zone=dl-phac-alpha-canada-ca --name=dl.phac.alpha.canada.ca. --type=TXT --ttl=300 "TADA" --project=${PROJECT_ID}
gcloud dns record-sets transaction execute --zone=dl-phac-alpha-canada-ca --project=${PROJECT_ID}
```
