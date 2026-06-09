# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root via Turbo (npm workspaces + Turborepo):

```bash
npm run dev          # start all dev servers
npm run build        # build all packages
npm run lint         # lint all packages
npm run typecheck    # type-check all packages
npm run format       # format all files with Prettier
```

To run a command in a single package:
```bash
npm run dev --workspace=web
npm run typecheck --workspace=@workspace/ui
```

To add a new shadcn component to the UI package:
```bash
npx shadcn@latest add <component> -c apps/web
```
Components are placed in `packages/ui/src/components/`.

## Architecture

This is a **npm workspaces + Turborepo monorepo** with two packages:

- **`apps/web`** — Vite + React app that serves as the component showcase (`App.tsx` renders every component). It is the dev/preview environment, not a shipped product.
- **`packages/ui`** — The actual design system library (`@workspace/ui`). All components live here and are consumed by `apps/web` (and intended to be consumed by other apps).

### Component layer (`packages/ui`)

Components are built on **Base UI** (`@base-ui/react`) as the headless primitive layer, styled with **Tailwind CSS v4** and **CVA** (class-variance-authority) for variant management. The pattern for every component:

1. Import the Base UI primitive (e.g. `Button as ButtonPrimitive` from `@base-ui/react/button`)
2. Define variants with `cva()`
3. Export a thin wrapper that merges `cn()` + CVA variants + forwarded props

The `cn()` helper (`packages/ui/src/lib/utils.ts`) combines `clsx` + `tailwind-merge`.

### Styling

- **Tailwind CSS v4** — configured directly in `packages/ui/src/styles/globals.css` using `@theme inline` blocks (no `tailwind.config.js`).
- Design tokens (colors, radius, fonts) are CSS custom properties defined in `:root` / `.dark` in `globals.css`. Colors use **oklch**.
- The global stylesheet is exported as `@workspace/ui/globals.css` and imported once in `apps/web/src/main.tsx`.
- Theme toggling (light/dark/system) is handled by `apps/web/src/components/theme-provider.tsx` which adds/removes `.dark` on `<html>`. Press `d` to toggle theme in the dev app.

### Package exports (`packages/ui`)

```
@workspace/ui/globals.css     → src/styles/globals.css
@workspace/ui/components/*    → src/components/*.tsx
@workspace/ui/lib/*           → src/lib/*.ts
@workspace/ui/hooks/*         → src/hooks/*.ts
```

No build step is needed for the UI package — Vite resolves source files directly via the workspace dependency.

### Path aliases

- In `apps/web`: `@/` → `apps/web/src/`
- Cross-package imports always use the `@workspace/ui/...` export paths, never relative paths across package boundaries.
