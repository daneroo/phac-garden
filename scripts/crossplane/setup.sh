#!/usr/bin/env bash
# Inspired by https://raw.githubusercontent.com/vfarcic/idp-demo/main/setup.sh

echo -e "-= Section: Checking dependencies (homebrew) =-"

declare -A brew_formulas
brew_formulas=(["kubectl"]="kubernetes-cli" ["gcloud"]="google-cloud-sdk" ["gh"]="gh")

tools=("gum" "jq" "yq" "kubectl" "helm" "gcloud" "gh")
missing_tools=()
install_cmd="brew install"

for tool in "${tools[@]}"; do
    if command -v ${tool} &> /dev/null; then
        echo "✓ - ${tool} is installed"
    else
        brew_formula=${brew_formulas[$tool]:-$tool}
        echo "✗ - ${tool} not found: brew install ${brew_formula}"
        missing_tools+=("${brew_formula}")
    fi
done

if [ ${#missing_tools[@]} -ne 0 ]; then
    echo ""
    echo "You can install all missing tools at once using the following command:"
    echo "${install_cmd} ${missing_tools[@]}"
else
    echo "All dependencies are installed!"
fi

echo -e "\n-= Checking GCP Authentication =-"

if gcloud auth list --format='value(account)' | grep '@'; then
    echo "✓ - You are logged into GCP"
else
    echo "✗ - You are not logged into GCP."
    read -p "Would you like to log in now? (y/N) " response
    if [[ $response =~ ^(yes|y) ]]; then
        gcloud auth login
        if ! gcloud auth list --format='value(account)' | grep '@'; then
            echo "Failed to log in. Please try again."
            exit 1
        fi
    else
        echo "Please log in to GCP before running this script again."
        exit 1
    fi
fi

echo -e "\n-= Setting GCP Project =-"

# get current configured project
current_project=$(gcloud config get-value project 2>/dev/null)

if [ -z "$current_project" ]; then
    echo "No project currently configured."
else
    echo "Current GCP Project is set to $current_project"
    read -p "Would you like to switch to a different project? (y/N) " response
    if [[ $response =~ ^(yes|y) ]]; then
        current_project=""
    else
        echo "Continuing with current project: $current_project"
        current_project_is_set=true
    fi
fi

if [ -z "$current_project" ] && [ -z "$current_project_is_set" ]; then
    # get list of projects user has access to
    IFS=$'\n'
    projects=($(gcloud projects list --format='value(projectId)'))

    if (( ${#projects[@]} )); then
        echo "Available projects:"
        for i in "${!projects[@]}"; do 
            printf "%d) %s\n" $((i+1)) "${projects[$i]}"
        done

        # ask user to select a project
        echo "Please enter the number of the project you want to use:"
        read project_number
        selected_project="${projects[$((project_number-1))]}"
        gcloud config set project "$selected_project"
        echo "✓ - GCP Project set to $selected_project"
    else
        echo "No available projects found. Please create a new project and run the script again."
        exit 1
    fi
fi

echo -e "\n-= Setting up Kubernetes Cluster =-"

# Variables
cluster_name="crossplane-quickstart"
REGION="northamerica-northeast1"

# Check if Kind cluster with name 'crossplane-quickstart' exists
if kind get clusters | grep -q "$cluster_name"; then
    echo "Kind cluster '$cluster_name' exists, we'll use it."
    cluster_type="Kind"
# Check if GKE Autopilot cluster with name 'crossplane-quickstart' exists
elif gcloud container clusters list --format='value(name)' --filter="name:$cluster_name" --region=$REGION | grep -q "$cluster_name"; then
    echo "GKE Autopilot cluster '$cluster_name' exists, we'll use it."
    cluster_type="GKE"
else
    echo "No existing '$cluster_name' Kind or GKE Autopilot cluster found."
    cluster_type=$(gum choose {Kind,GKE})
    if [[ "$cluster_type" == "Kind" ]]; then
        kind create cluster --name "$cluster_name" --wait 5m
    elif [[ "$cluster_type" == "GKE" ]]; then
        gcloud container clusters create-auto "$cluster_name" --region=$REGION
        gcloud container clusters get-credentials "$cluster_name" --region=$REGION
    else
        echo "Invalid input, exiting."
        exit 1
    fi
fi

echo "✓ - Kubernetes cluster of type '$cluster_type' is ready"

echo -e "\n-= Installing Crossplane =-"

# Add Crossplane helm repository
if helm repo list | grep -q "crossplane-stable"; then
    echo "Crossplane helm repo already added"
else
    echo "Adding Crossplane helm repo"
    helm repo add crossplane-stable https://charts.crossplane.io/stable
fi

# Update helm repositories
helm repo update

# Install Crossplane helm chart
if helm list -n crossplane-system | grep -q "crossplane"; then
    echo "Crossplane already installed"
else
    echo "Installing Crossplane"
    helm install crossplane crossplane-stable/crossplane --namespace crossplane-system --create-namespace

    echo "Waiting for Crossplane pods to be ready..."
    end=$((SECONDS+300))  # 5 minutes timeout
    while ! kubectl get pods -n crossplane-system | grep -q "Running"; do
      if [ $SECONDS -ge $end ]; then
        echo "Timeout waiting for Crossplane pods to be ready"
        exit 1
      fi
      sleep 2
    done
    echo "✓ - Crossplane pods are ready"
fi

echo "✓ - Crossplane installation complete"

echo -e "\n-= Creating GCP Service Account =-"

# Set the PROJECT_ID and SA_NAME environment variables
PROJECT_ID=$(gcloud config get-value project)
SA_NAME="crossplane-sa"

# Check if the service account exists
if gcloud iam service-accounts list --filter="email:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" | grep -q "${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"; then
    echo "Service account '$SA_NAME' already exists"
else
    # Create the Service Account
    gcloud iam service-accounts create ${SA_NAME} \
        --display-name="Crossplane Service Account" \
        --project=${PROJECT_ID}
    echo "✓ - Service account '$SA_NAME' created"

    # Wait until the service account is created, up to a maximum of 5 minutes
    echo "Waiting for service account '$SA_NAME' to be created..."
    end=$((SECONDS+300))  # 300 seconds = 5 minutes
    while ! gcloud iam service-accounts list --filter="email:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" | grep -q "${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"; do
        # If the timeout has been reached, exit with an error message
        if [ $SECONDS -ge $end ]; then
            echo "Timeout waiting for service account '$SA_NAME' to be created"
            exit 1
        fi
        sleep 5
    done
    echo "✓ - Service account '$SA_NAME' is now created"
fi

# Check if the service account has the necessary role
if gcloud projects get-iam-policy ${PROJECT_ID} --flatten="bindings[].members" --filter="bindings.members:serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" --format='table(bindings.role)' | grep -q "roles/storage.admin"; then
    echo "Service account '$SA_NAME' already has 'roles/storage.admin' role"
else
    # Assign Roles to the Service Account
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
      --member="serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/storage.admin" \
      --condition=None --verbosity=error
    echo "✓ - Role 'roles/storage.admin' assigned to service account '$SA_NAME'"
fi

# Generate a JSON Key for the Service Account
if [ -f "gcp-credentials.json" ]; then
    echo "File 'gcp-credentials.json' already exists"
else
    gcloud iam service-accounts keys create gcp-credentials.json \
        --iam-account=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
    echo "✓ - JSON Key for service account '$SA_NAME' created and saved to 'gcp-credentials.json'"
fi

echo "✓ - GCP Service Account setup complete"

echo -e "\n-= Installing GCP Provider and Config =-"

# Install the provider into the Kubernetes cluster
if kubectl get provider upbound-provider-gcp 2>/dev/null; then
    echo "Provider 'upbound-provider-gcp' already exists"
else
    cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-gcp
spec:
  package: xpkg.upbound.io/upbound/provider-gcp:v0.28.0
EOF
    echo "✓ - Provider 'upbound-provider-gcp' installed"
fi

echo "Waiting for the GCP provider to become healthy..."

while true; do
    PROVIDER_STATUS=$(kubectl get provider upbound-provider-gcp -o jsonpath='{.status.conditions[?(@.type=="Healthy")].status}')
    if [ "$PROVIDER_STATUS" == "True" ]; then
        break
    fi
    echo "Provider is not yet healthy, waiting for 10 seconds..."
    sleep 10
done

echo "✓ - Provider 'upbound-provider-gcp' is healthy"

# Create a Kubernetes secret with the GCP credentials
if kubectl get secret gcp-secret -n crossplane-system 2>/dev/null; then
    echo "Secret 'gcp-secret' already exists in namespace 'crossplane-system'"
else
    kubectl create secret \
    generic gcp-secret \
    -n crossplane-system \
    --from-file=creds=./gcp-credentials.json
    echo "✓ - Secret 'gcp-secret' created in namespace 'crossplane-system'"
fi

# Wait for the ProviderConfig CRD to be available
echo "Waiting for the ProviderConfig CRD to be available..."
kubectl wait --for=condition=Established crd/providerconfigs.gcp.upbound.io --timeout=60s

if [ $? -eq 0 ]; then
    echo "✓ - ProviderConfig CRD is available"
else
    echo "Failed to establish ProviderConfig CRD within the specified timeout, exiting."
    exit 1
fi

# Create a ProviderConfig
if kubectl get ProviderConfig default -n crossplane-system 2>/dev/null; then
    echo "ProviderConfig 'default' already exists in namespace 'crossplane-system'"
else
    cat <<EOF | kubectl apply -f -
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: ${PROJECT_ID}
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: creds
EOF
    echo "✓ - ProviderConfig 'default' created in namespace 'crossplane-system'"
fi

echo "✓ - GCP Provider installation complete"
