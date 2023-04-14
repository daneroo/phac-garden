# Nx monorepo

- Nx monorepo on <https://cloud.nx.app/orgs>
  - [Setup](#setup)

## Adding a go project

This create an app with `build` `serve` `test` and `lint` commands.

- `nx run go-time:test`
- `nx run go-time:lint`
- `nx run go-time:serve`
- `nx run go-time:build`: this builds the binary into `dist/apps/go-time`

```bash
pnpm add -D @nx-go/nx-go

nx g @nx-go/nx-go:app go-time
```

## Setup

This was only done once, to create the monorepo.  It is not a step that needs to be repeated.

```bash
# Note I am using pnpm, not npm
pnpm dlx create-nx-workspace phac-garden --preset=empty --cli=nx --packageManager=pnpm --nx-cloud true
# instead of
npx create-nx-workspace@latest phac-garden --cli=nx --packageManager=pnpm --preset=empty
# Remote caching was enabled, and claimed see <https://cloud.nx.app/orgs>
```
