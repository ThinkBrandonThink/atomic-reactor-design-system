# CLAUDE.md

## Commands

**Adding/adapting a UI component** → **`add-shadcn-component` skill**. `shadcn add` emits Radix + default styles, but this repo is **Base UI** (`@base-ui/react`) — a component isn't done until it's rewritten to Base UI and matches the existing files. Components: `packages/ui/src/components/`.

**Design tokens or theming** (color, radius, spacing, font, shadow, z-index — adding/moving/wiring, or per-brand `.theme-*` files) → **`design-tokens` skill**. Owns the three-tier token system. Token files: `packages/ui/src/styles/`.

**A color's actual value or WCAG AA contrast** → **`color-tokens` skill**. Division of labor: `design-tokens` = structure/placement/wiring/theming; `color-tokens` = color values + contrast.

**Keeping Storybook in sync with the code** (a component, variant, or token changed and the `*.stories.tsx` that document it may be stale; "are the stories current?", "did I miss a story?") → **`storybook-sync` skill**. Run it as the follow-up after `add-shadcn-component` or `design-tokens` change code. Stories: `packages/ui/src/components/*.stories.tsx`.

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

#### Required component conventions

Every component replicates a fixed convention set — `data-slot`, the focus/invalid/press patterns, radius via the `--radius` scale, `color-mix` hover tints, icon sizing — so the system stays consistent. The **`add-shadcn-component` skill** has the full checklist and the Radix→Base UI mapping; when adding/editing, follow it and mirror the closest existing file in `packages/ui/src/components/`.

### Styling

- **Tailwind CSS v4** — configured in CSS via `@theme inline` blocks (no `tailwind.config.js`).
- Design tokens are CSS custom properties (colors in **oklch**) organized into **three tiers**, each in its own file under `packages/ui/src/styles/`:
  - `primitives.css` — the raw palette / raw values (tier 1, internal).
  - `semantic.css` — role tokens (`--primary`, `--background`, …), the light/dark split, the `@theme inline` color/radius/font mappings, and the **brand defaults** (see below).
  - `components.css` — per-component knobs (`--button-radius`, `--card-spacing`, …), the public theming API.
  - `themes/` — consumer `.theme-*` override files (and `_template.css`).
  Each tier may only reference the tier(s) above it. `globals.css` imports these in order and no longer holds the tokens itself. The **`design-tokens` skill** owns this structure and enforces it with a checker.
- The global stylesheet is exported as `@workspace/ui/globals.css` and imported once in `apps/web/src/main.tsx`.
- Theme toggling (light/dark/system) is handled by `apps/web/src/components/theme-provider.tsx` which adds/removes `.dark` on `<html>`. Press `d` to toggle theme in the dev app.

#### `globals.css` (entry point — order is load-bearing)

It holds no tokens; it imports and wires. Preserve, in order: the four base `@import`s (`tailwindcss` → `tw-animate-css` → `shadcn/tailwind.css` → `@fontsource-variable/inter`) then the three tiers (`primitives` → `semantic` → `components`); `@custom-variant dark (&:is(.dark *))` (makes `dark:` work with the `.dark` class); the `@source` globs (`../../../apps/**`, `../../../components/**`, `../**` — Tailwind's class scan, dropping one silently drops styles); and `@layer base` (the `*`/`body` resets + `cursor: pointer` on enabled buttons).

Token definitions and the `@theme inline` mappings live in the tier files, not here — the **`design-tokens` skill** covers wiring (colors need a `--color-*` mapping to get utilities; radius/spacing are consumed via `rounded-(--token)` syntax).

#### Brand tokens (the Atomic Reactor brand — confirm before changing)

The brand, not stock shadcn neutrals. Values live in `semantic.css`/`primitives.css` (the source of truth); what matters here is the *intent*. Changeable, but confirm before changing a brand token — and if a tool (`shadcn add`, etc.) *silently* swaps them for neutrals, that's not an intended change, so keep the brand. The constraints:

- **Primary = yellow** (`--primary`/`--primary-foreground`, same for sidebar primary) — brand color, not neutral; foreground stays AA-readable on it.
- **Charts = multi-hue categorical palette** (`--chart-1`…`--chart-5`) — **not a brand color** (the brand is yellow only). Five distinct hues; each series must stay **visible on its background in both themes** (3:1 non-text contrast, why the values differ per theme) and be told apart by **hue plus a non-color cue** (label/marker/pattern — WCAG 1.4.1, since the luminance-based contrast ratio can't measure hue). Free to retune for accessibility — no brand lock.
- **Font = Inter Variable** (`--font-sans`); `--font-heading` aliases it.
- **Radius = one base `--radius` + a multiplicative scale** (`--radius-sm`…`4xl`); changing the base rescales everything.

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

# Coding Guide

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
