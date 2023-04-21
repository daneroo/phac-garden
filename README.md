# phac-garden

This is a monorepo for the PHAC Garden project.
I gather my experiments here, and try to document the process as I go.

As it is a monorepo it will contain many different projects.

- Serverless functions (deployed to Cloud Run)
- Static Sites (deployed to Cloud Run)
- Next.js site(s) (deployed to Cloud Run, and perhaps Vercel)

## TODO

- [ ] move to packages/site to apps/site-nextra
- [x] deploy to vercel (site)
  - [x] remove pnpm-lock in packages/site
  - [x] set VERCEL_DEEP_CLONE=true
    - The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning.
- [x] deploy to cloud run (site and time-go)
  - [x] time-go, time-deno, site-nginx, site-caddy (fixed)
  - [ ] site-nextra
  - [ ] `phac-garden.r.dl.phac.alpha.canada.ca` needs a loadbalancer,and ssl cert
- Dockerfile for packages/site
  - [x] final image node:18-slim
  - [x] remove some node_modules to trim (kludge)
- [x] realclean target (node modules, dist, .next, etc)
- [ ] CI/CD
  - [ ] GitHub Actions - <https://pnpm.io/continuous-integration#github-actions>
  - [x] Vercel
  - [ ]cloudbuild
- [ ] Get some logos and stuff
- [ ] Wse a docker plugin for nx <https://github.com/gperdomor/nx-tools/blob/main/packages/nx-container/README.md>
- [ ] Deprecate and/or archive the original repositories.
  - [x] [simple-gke-infra Experiments with Keith (fork)](https://github.com/daneroo/simple-gke-infra)
  - [Epicenter w/ Chris Allison (fork)](https://github.com/daneroo/phac-epi_center)

## Operation

This is from nx-audiobook...

```bash
pnpm run dev  # nx run site:dev
# nx run-many --target=XXX
pnpm lint
pnpm test
pnpm build
# also have pnpm affected:XXX
```

## Monorepo orchestration

To manage the different projects inside a single git repository we will be using [Nx](https://nx.dev/).

As Nx is based on [Node.js](https://nodejs.org/en) we have chosen [pnpm](https://pnpm.io/) as our package manager.

## Infra and CI/CD

We will use a combination of GitHub Actions, GCP `gcloud` command and GCP Cloud Build.
