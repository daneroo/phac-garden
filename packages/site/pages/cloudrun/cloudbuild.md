# Using Cloud Build Triggers

There is a limitation of 100 steps in a cloudbuild.yaml file.

So we will make separate triggers and cloubuild.yaml files for each service.


```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export SVC_GROUP="simple-gke-infra"

gcloud builds triggers list --region ${REGION}

# create on trigger 
gcloud builds triggers create github \
  --name=test-caddy-001 \
  --region ${REGION} \
  --repo-name=simple-gke-infra \
  --repo-owner=daneroo \
  --branch-pattern="^main$" \
  --build-config=caddy-site/cloudbuild.yaml

# and now delete it
gcloud builds triggers delete --region ${REGION} test-caddy-001

# Now, in a loop
for svc in django-time go-time deno-time nginx-site caddy-site; do
  gcloud builds triggers create github \
    --name=${SVC_GROUP}-${svc} \
    --region ${REGION} \
    --repo-name=simple-gke-infra \
    --repo-owner=daneroo \
    --branch-pattern="^main$" \
    --build-config=${svc}/cloudbuild.yaml
done

# and now delete them all
for svc in django-time go-time deno-time nginx-site caddy-site; do
  gcloud builds triggers delete --region ${REGION} ${SVC_GROUP}-${svc}
done

```

