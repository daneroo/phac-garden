import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config("gcp");
const projectId = config.require("project");
const region = config.require("region");
const serviceName = "time-deno";
const domain = "time-deno.garden.dl.phac.alpha.canada.ca";

// Get the existing Cloud Run service details.
let cloudRunService = gcp.cloudrun.getService({
  name: serviceName,
  location: region,
});

// Log the Cloud Run service details.
// cloudRunService.then((service) => {
//   pulumi.log.info(`Cloud Run service URL: service.statuses[0].url}`);
// });

const certificate = new gcp.compute.ManagedSslCertificate(
  "phac-garden-certificate",
  {
    managed: {
      domains: [domain],
    },
  }
);

// Create a Serverless Region Network Endpoint Group (NEG).
const neg = new gcp.compute.RegionNetworkEndpointGroup("phac-garden-neg", {
  region: region,
  networkEndpointType: "SERVERLESS",
  cloudRun: {
    service: serviceName,
  },
});

// Create a Load Balancer backend.
const backend = new gcp.compute.BackendService("phac-garden-backend", {
  portName: "http",
  protocol: "HTTP",
  connectionDrainingTimeoutSec: 300,
  backends: [
    {
      group: neg.selfLink,
    },
  ],
});

// Create a URL map.
const urlMap = new gcp.compute.URLMap("phac-garden-url-map", {
  defaultService: backend.selfLink,
});

// Create a target HTTPS proxy.
const targetHttpsProxy = new gcp.compute.TargetHttpsProxy(
  "phac-garden-https-proxy",
  {
    urlMap: urlMap.selfLink,
    sslCertificates: [certificate.id],
  }
);

const forwardingRule = new gcp.compute.GlobalForwardingRule(
  "phac-garden-forwarding-rule",
  {
    target: targetHttpsProxy.selfLink,
    portRange: "443",
  }
);

// Get the existing managed zone details.
// to get the id:
//  gcloud dns managed-zones describe dl-phac-alpha-canada-ca
const dlPhacAlphaExistingManagedZone = gcp.dns.ManagedZone.get(
  "dl-phac-alpha-canada-ca",
  "5975330339948395253"
);

// Create a DNS record.
let dnsRecord = new gcp.dns.RecordSet("phac-garden-dns-record", {
  // domain, with a trailing "."
  name: `${domain}.`,
  managedZone: dlPhacAlphaExistingManagedZone.name,
  type: "A",
  ttl: 300,
  rrdatas: [forwardingRule.ipAddress],
});
