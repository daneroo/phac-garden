# GCP-COMPUTE

As a side effort, just get a VM up and running on GCP.

- Use it as a docker enabled developer environment
  - (optionally) Use tailscale to interact with it from my Mac
- Connect to a GCP Cloud SQL instance

## Operations

```bash
gcloud compute instances list

gcloud compute instances start gcp-dev-1
gcloud compute instances stop gcp-dev-1

gcloud compute ssh --zone "northamerica-northeast1-a" "gcp-dev-1" --project "pdcp-cloud-009-danl"

# with explicit project zone
gcloud compute instances start gcp-dev-1 --project=pdcp-cloud-009-danl --zone=northamerica-northeast1-a
gcloud compute instances stop gcp-dev-1 --project=pdcp-cloud-009-danl --zone=northamerica-northeast1-a

```

## gcloud provisioning

- e2-medium (2 vCPUs, 4 GB memory)
- debian based image (bullseye) - 10GB disk
- allow no traffic for now (tailscale)

note: had to create network, subnet, and firewall rules

```bash
# stuff goes here
gcloud compute instances list
gcloud compute instances delete gcp-dev-1
# size 40 
# e2-standard-4 (4 vCPUs, 16 GB memory)
# e2-standard-2 (2 vCPUs, 8 GB memory)
# e2-medium (2 vCPUs, 4 GB memory)
gcloud compute instances create gcp-dev-1 --project=pdcp-cloud-009-danl --zone=northamerica-northeast1-a --machine-type=e2-standard-4 --network-interface=network-tier=PREMIUM,nic-type=VIRTIO_NET,subnet=mtl --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=101744527752-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --create-disk=auto-delete=yes,boot=yes,device-name=instance-2,image=projects/debian-cloud/global/images/debian-11-bullseye-v20230306,mode=rw,size=40,type=projects/pdcp-cloud-009-danl/zones/northamerica-northeast1-a/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --labels=ec-src=vm_add-gcloud --reservation-affinity=any
```

### docker

```bash
## keys
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

## repo
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

## install
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo groupadd docker
sudo usermod -aG docker $USER
```

### tailscale

```bash
curl -fsSL https://pkgs.tailscale.com/stable/debian/bullseye.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/debian/bullseye.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list

sudo apt-get update
sudo apt-get install tailscale

sudo tailscale up

tailscale ip -4
mkdir .ssh
cat >> .ssh/authorized_keys
## content of pbcopy < ~/.ssh/id_ed25519.pub
ctrl-D

ssh daniel_lauzon_gcp_hc_sc_gc_ca@100.104.41.48
```
