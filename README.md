# phac-garden

This is a monorepo for the PHAC Garden project.
I gather my experiments here, and try to document the process as I go.

As it is a monorepo it will contain many different projects.

- Serverless functions (deployed to CLoud Run)
- Static Sites (deployed to Cloud Run)
- Next.js site(s) (deployed to Cloud Run, and perhaps Vercel)

## TODO

- [ ] deploy to cloud run (site and go-time)
  - [ ] as http endpoint
  - [ ] `phac-garden.r.dl.phac.alpha.canada.ca` needs a loadbalancer,...
- [ ] CI/CD
  - GitHub Actions
  - vercel
  - cloudbuild
- [ ] Get some logos and stuff
- [ ] realclean target (node modules, dist, .next, etc)
- [ ] Wse a docker plugin for nx <https://github.com/gperdomor/nx-tools/blob/main/packages/nx-container/README.md>
- [ ] Deprecate and/or archive the original repositories.
  - [simple-gke-infra Experiments with Keith (fork)](https://github.com/daneroo/simple-gke-infra)
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
