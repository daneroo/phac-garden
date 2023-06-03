import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP storage bucket
const bucket = new gcp.storage.Bucket("my-bucket", {
  name: "mybucket.dl.phac.alpha.canada.ca",
  location: "northamerica-northeast1",
  uniformBucketLevelAccess: true, // Enable Uniform Bucket-Level Access
  website: {
    mainPageSuffix: "index.html",
  },
});

// Create a GCP bucket object to upload the HTML file into the GCP storage bucket
const htmlFile = new gcp.storage.BucketObject("index-html", {
  name: "index.html",
  content:
    "<><><title>Hello World</title></head><body><h1>Hello World!</h1></body></html>",
  contentType: "text/html",
  bucket: bucket.name,
});

// Create a managed ssl certificate for https
const sslCert = new gcp.compute.ManagedSslCertificate("managed-ssl-cert", {
  managed: {
    domains: ["mybucket.dl.phac.alpha.canada.ca"], // your domain here
  },
});

// Create a backend bucket
const backendBucket = new gcp.compute.BackendBucket("backend-bucket", {
  bucketName: bucket.name,
  enableCdn: true,
});

// Create the load balancer to redirect traffic from HTTPS to the backend bucket
const globalForwardingRule = new gcp.compute.GlobalForwardingRule(
  "global-forwarding-rule",
  {
    target: pulumi.interpolate`${backendBucket.selfLink}`,
    portRange: "80",
    ipAddress: "0.0.0.0",
  }
);

// Export resources
export const bucketUrl = pulumi.interpolate`https://${globalForwardingRule.selfLink}`;
