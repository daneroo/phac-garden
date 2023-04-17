# Nx monorepo

- Nx monorepo on <https://cloud.nx.app/orgs>
  - [Setup](#setup)

## Top level targets

Note: *Having trouble with cache? Try `nx reset`*

Note: *Check for outdated dependencies with `pnpm outdated -r`*, and update them with `pnpm update -r`

Each of lint,test, build have `nx run-many --target=TARGET --all` in package.json.
We  also have pnpm affected:XXX

- `pnpm run dev` : `nx run site:dev`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- `pnpm run affected:lint`
- `pnpm run affected:test`
- `pnpm run affected:build`

## Adding a Nextra project

I cloned: <https://github.com/shuding/nextra-docs-template>

Another option would have been: <https://github.com/jaredpalmer/nextra-blank-custom-theme>, which has tailwind already setup

```bash
pnpm run dev
```

## Adding a go project

This create an app with `build` `serve` `test` and `lint` commands.

- `nx run time-go:test`
- `nx run time-go:lint`
- `nx run time-go:serve`
- `nx run time-go:build`: this builds the binary into `dist/apps/time-go`

```bash
pnpm add -D @nx-go/nx-go

nx g @nx-go/nx-go:app time-go
cd apps/time-go
go mod init github.com/daneroo/phac-garden/apps/time-go
go mod tidy
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
