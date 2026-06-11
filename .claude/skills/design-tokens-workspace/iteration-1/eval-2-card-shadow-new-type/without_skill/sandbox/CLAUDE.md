# CLAUDE.md

## Commands

**Adding or adapting a UI component** → use the **`add-shadcn-component` skill** (`.claude/skills/add-shadcn-component/`). It owns the full workflow: the `shadcn add` command, the Radix→Base UI rewrite, and every required convention. Key point it encodes: `shadcn add` emits a **Radix-based, default-styled** file, but this repo is **Base UI**, so a component isn't "added" until it's been rewritten to `@base-ui/react` and matches the existing components exactly. Components live in `packages/ui/src/components/`.

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

Every component **must** replicate a fixed set of conventions — the `data-slot` attribute, the focus/invalid/press patterns, radius via the `--radius` scale, `color-mix` hover tints, and icon sizing — exactly as the existing components do. They are how the system stays visually consistent. The full checklist and the Radix→Base UI translation details live in the **`add-shadcn-component` skill** (`.claude/skills/add-shadcn-component/`); when adding or editing a component, follow it and mirror the closest existing file in `packages/ui/src/components/`.

### Styling

- **Tailwind CSS v4** — configured directly in `packages/ui/src/styles/globals.css` using `@theme inline` blocks (no `tailwind.config.js`).
- Design tokens (colors, radius, fonts) are CSS custom properties defined in `:root` / `.dark` in `globals.css`. Colors use **oklch**.
- The global stylesheet is exported as `@workspace/ui/globals.css` and imported once in `apps/web/src/main.tsx`.
- Theme toggling (light/dark/system) is handled by `apps/web/src/components/theme-provider.tsx` which adds/removes `.dark` on `<html>`. Press `d` to toggle theme in the dev app.

#### `globals.css` structure (exact — do not reorder or remove)

The top of the file is load-bearing. Preserve it as-is:

1. **Import order:** `tailwindcss` → `tw-animate-css` → `shadcn/tailwind.css` → `@fontsource-variable/inter`.
2. **`@custom-variant dark (&:is(.dark *));`** — this is what makes `dark:` work with the class-based `.dark` toggle. Required.
3. **`@source` globs** — `../../../apps/**`, `../../../components/**`, `../**` (all `.{ts,tsx}`). These tell Tailwind v4 where to scan for classes; removing one silently drops styles.
4. **`@theme inline` block** — maps the `--color-*`, `--radius-*`, and `--font-*` Tailwind theme keys onto the raw `:root` custom properties. New tokens must be wired here too, or Tailwind utilities won't see them.
5. **`@layer base`** — global resets: `* { border-border outline-ring/50 }`, `body { bg-background text-foreground }`, and `cursor: pointer` on enabled buttons. Keep.

#### Brand tokens (LOCKED — never revert to shadcn defaults)

These are the **Atomic Reactor** brand, not stock shadcn neutrals. Do not overwrite them with generated defaults; flag any proposed change before making it:

- **Primary = amber/gold:** `--primary: oklch(0.852 0.199 91.936)` (light) / `oklch(0.795 0.184 86.047)` (dark), with `--primary-foreground: oklch(0.421 0.095 57.708)`. Sidebar primary follows the same amber family.
- **Charts = teal/cyan ramp:** `--chart-1`…`--chart-5` (e.g. `oklch(0.865 0.127 207.078)` → `oklch(0.45 0.085 224.283)`), identical in light and dark.
- **Font:** `--font-sans: 'Inter Variable', sans-serif` (via `@fontsource-variable/inter`); `--font-heading` aliases `--font-sans`.
- **Radius scale:** base `--radius: 0.625rem`, with a multiplicative scale — `sm ×0.6`, `md ×0.8`, `lg ×1`, `xl ×1.4`, `2xl ×1.8`, `3xl ×2.2`, `4xl ×2.6`. Components reference these, so changing `--radius` rescales the whole system intentionally.

When `shadcn add` (or any tool) regenerates `globals.css` or proposes a neutral palette, **discard the token changes** and keep the values above.

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
