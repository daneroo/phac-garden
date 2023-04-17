# Using Cloud Build Triggers

There is a limitation of 100 steps in a cloudbuild.yaml file.

So we will make separate triggers and cloubuild.yaml files for each service.

<Callout type="warning">
  Be sure to replace your PROJECT_ID environment variable in these scripts
</Callout>

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export GITHUB_REPO_NAME="phac-garden"

# list all existing triggers
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# Create a Cloud Build trigger
#  The first time we connect a github repository, you may get an error, 
#  requiring you to connect the repo in the web console, in the "Manage Repositories" section
gcloud builds triggers create github \
  --name=test-site-nginx-001 \
  --region ${REGION} \
  --repo-name=${GITHUB_REPO_NAME} \
  --repo-owner=daneroo \
  --branch-pattern="^main$" \
  --build-config=apps/site-nginx/cloudbuild.yaml

# confirm the trigger was created
gcloud builds triggers describe test-site-nginx-001 --region ${REGION}

# list all existing triggers - to see if the new trigger appeared
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# and now delete it - that was only a test
gcloud builds triggers delete --region ${REGION} test-site-nginx-001

# Now, in a loop create a trigger for each of our services
for svc in time-go time-deno site-nginx site-caddy; do
  gcloud builds triggers create github \
    --name=${GITHUB_REPO_NAME}-${svc} \
    --region ${REGION} \
    --repo-name=${GITHUB_REPO_NAME} \
    --repo-owner=daneroo \
    --branch-pattern="^main$" \
    --build-config=${svc}/cloudbuild.yaml
done

# list all existing triggers - to see if the new triggers appeared, one for each service
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# At this point you could push to the main branch of your github repo, and see the triggers fire

# If this was only a test, you can delete all the triggers with the following command
for svc in time-go time-deno site-nginx site-caddy; do
  gcloud builds triggers delete --region ${REGION} ${REPO_NAME}-${svc}
done

```
