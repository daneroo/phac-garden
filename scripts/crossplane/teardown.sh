#!/usr/bin/env bash

echo -e "\n-= Deleting GCP Provider =-"

# Delete the ProviderConfig
if kubectl get ProviderConfig default -n crossplane-system 2>/dev/null; then
    kubectl delete ProviderConfig default -n crossplane-system
    echo "✓ - ProviderConfig 'default' deleted"
else
    echo "ProviderConfig 'default' not found, skipping deletion"
fi

# Delete the Secret with GCP credentials
if kubectl get secret gcp-secret -n crossplane-system 2>/dev/null; then
    kubectl delete secret gcp-secret -n crossplane-system
    echo "✓ - Secret 'gcp-secret' deleted"
else
    echo "Secret 'gcp-secret' not found, skipping deletion"
fi

# Delete the JSON Key for the Service Account ('gcp-credentials.json')
if [ -f "gcp-credentials.json" ]; then
    rm gcp-credentials.json
    echo "✓ - Local file 'gcp-credentials.json' deleted"
else
    echo "Local file 'gcp-credentials.json' not found, skipping deletion"
fi

# Delete the GCP provider
if kubectl get provider upbound-provider-gcp 2>/dev/null; then
    kubectl delete provider upbound-provider-gcp
    echo "✓ - Provider 'upbound-provider-gcp' deleted"
else
    echo "Provider 'upbound-provider-gcp' not found, skipping deletion"
fi

echo -e "\n-= Deleting GCP Service Account =-"

# Set the PROJECT_ID and SA_NAME environment variables
PROJECT_ID=$(gcloud config get-value project)
SA_NAME="crossplane-sa"

# Remove the IAM policy binding
if gcloud projects get-iam-policy ${PROJECT_ID} --flatten="bindings[].members" --filter="bindings.members:serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" --format='table(bindings.role)' | grep -q "roles/storage.admin"; then
    gcloud projects remove-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin" \
    --condition=None --verbosity=error
    echo "✓ - IAM policy binding removed"
else
    echo "IAM policy binding not found, skipping deletion"
fi

# Delete the GCP service account keys
if gcloud iam service-accounts keys list --iam-account=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com --format="get(name)" --filter='keyType=USER_MANAGED' | grep -q 'projects'; then
    for KEY_ID in $(gcloud iam service-accounts keys list --iam-account=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com --format="get(name)" --filter='keyType=USER_MANAGED'); do
        echo "Deleting key: $KEY_ID"
        gcloud iam service-accounts keys delete $KEY_ID --iam-account=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com --quiet
    done
    echo "✓ - GCP service account keys deleted"
else
    echo "No GCP service account keys found, skipping deletion"
fi

# Delete the Service Account
if gcloud iam service-accounts list --filter="email:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" | grep -q "${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"; then
    gcloud iam service-accounts delete ${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com --quiet
    echo "✓ - Service account '$SA_NAME' deleted"
else
    echo "Service account '$SA_NAME' not found, skipping deletion"
fi

echo -e "\n-= Deleting Crossplane chart =-"

# Delete Crossplane helm chart
if helm list -n crossplane-system | grep -q "crossplane"; then
    helm delete crossplane -n crossplane-system
    echo "✓ - Crossplane deleted"
else
    echo "Crossplane not found, skipping deletion"
fi

# Variables
cluster_name="crossplane-quickstart"
REGION="northamerica-northeast1"

echo -e "\n-= Deleting Kubernetes Cluster =-"

# Delete the Kubernetes cluster
if kind get clusters | grep -q "$cluster_name"; then
    kind delete cluster --name "$cluster_name"
    echo "✓ - Kind cluster '$cluster_name' deleted"
elif gcloud container clusters list --format='value(name)' --filter="name:$cluster_name" --region=$REGION | grep -q "$cluster_name"; then
    gcloud container clusters delete "$cluster_name" --region=$REGION --quiet
    echo "✓ - GKE Autopilot cluster '$cluster_name' deleted"
else
    echo "No existing '$cluster_name' Kind or GKE Autopilot cluster found, skipping deletion"
fi

echo "-= Teardown complete =-"
