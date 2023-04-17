# Using Cloud Build Triggers

There is a limitation of 100 steps in a cloudbuild.yaml file.

So we will make separate triggers and cloubuild.yaml files for each service.


```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export REPO_NAME="garden-repo"

gcloud builds triggers list --region ${REGION}

# create on trigger 
gcloud builds triggers create github \
  --name=test-caddy-001 \
  --region ${REGION} \
  --repo-name=${REPO_NAME} \
  --repo-owner=daneroo \
  --branch-pattern="^main$" \
  --build-config=site-caddy/cloudbuild.yaml

# and now delete it
gcloud builds triggers delete --region ${REGION} test-caddy-001

# Now, in a loop
for svc in time-go time-deno site-nginx site-caddy; do
  gcloud builds triggers create github \
    --name=${REPO_NAME}-${svc} \
    --region ${REGION} \
    --repo-name=simple-gke-infra \
    --repo-owner=daneroo \
    --branch-pattern="^main$" \
    --build-config=${svc}/cloudbuild.yaml
done

# and now delete them all
for svc in time-go time-deno site-nginx site-caddy; do
  gcloud builds triggers delete --region ${REGION} ${REPO_NAME}-${svc}
done

```

