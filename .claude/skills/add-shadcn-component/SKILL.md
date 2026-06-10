---
name: add-shadcn-component
description: >-
  Add or adapt a component in the Atomic Reactor design system (the
  @workspace/ui package). Use this whenever someone wants a new UI component
  added to packages/ui — e.g. "add a tooltip", "we need a date picker in the
  design system", "pull in the shadcn switch", "create a Combobox component", or
  "convert this Radix component to Base UI". The key thing this skill exists for:
  `shadcn add` emits a Radix-based, default-styled file, but this repo runs on
  Base UI (@base-ui/react) with its own locked brand tokens and conventions, so
  the generated file is only a reference — it must be fully rewritten before the
  work is done. Trigger this even when the user just names a component to add and
  doesn't mention shadcn, Radix, or Base UI.
---

# Add a component to the Atomic Reactor design system

Components live in `packages/ui/src/components/` and are consumed as
`@workspace/ui/components/<name>`. The system is built on **Base UI**
(`@base-ui/react`) headless primitives, styled with **Tailwind v4** + **CVA**,
merged through the `cn()` helper.

The trap this skill protects against: `shadcn add` generates a **Radix** component
with **stock shadcn neutral styling**. This repo is **not Radix**. A component
isn't "added" until it has been rewritten to Base UI and matches the existing
components exactly. Treat the generated file as a starting reference you will
overwrite, not as the answer.

## Workflow

1. **Get a reference, if shadcn has one.**
   ```bash
   npx shadcn@latest add <component> -c apps/web
   ```
   If it succeeds, the file lands in `packages/ui/src/components/<component>.tsx`.
   Read it to see the intended structure (which sub-parts exist, the variant
   shape, the icons), but assume every import and most classes are wrong for this
   repo.

   **Many components won't be in the shadcn registry** — the repo already has all
   ~55 shadcn components, so most *new* work is wrapping a Base UI primitive
   shadcn doesn't ship (e.g. `meter`, `number-field`, `toolbar`). When `shadcn
   add` errors or has no such component, skip it and build directly from the Base
   UI primitive: confirm it exists in `node_modules/@base-ui/react/<name>/`, look
   at its exported parts, and lean even harder on the closest existing component
   (step 2) for structure and styling. The output is the same either way — a Base
   UI component that matches the repo conventions.

2. **Find the closest existing component and use it as the source of truth.**
   The repo already has ~55 components in `packages/ui/src/components/`. Open one
   or two that resemble what you're building and mirror them. This matters more
   than any rule below — the existing files *are* the spec.
   - Simple single-part interactive control → `button.tsx`, `badge.tsx`,
     `checkbox.tsx`, `switch.tsx`
   - Compound (header/trigger/panel) → `accordion.tsx`, `tabs.tsx`
   - Floating/overlay (menu, popover, tooltip, select) → `tooltip.tsx`,
     `select.tsx`, `popover.tsx`, `dropdown-menu.tsx`

3. **Rewrite to Base UI.** Replace Radix imports/primitives with `@base-ui/react`
   equivalents. The API shapes differ — part names, the `asChild`→`render`
   change, the `Portal`→`Positioner`→`Popup` overlay structure, and the
   `data-state`→`data-open`/`data-checked`/`data-active` attributes. The full
   mapping is in **[references/radix-to-base-ui.md](references/radix-to-base-ui.md)** —
   read it whenever you hit a primitive you haven't translated before.

4. **Apply every required convention** (next section). These are what keep the
   system visually consistent; copy them verbatim from the neighbor component.

5. **Verify.** Run `npm run typecheck -w @workspace/ui`. Then add the component to
   `apps/web/src/App.tsx`'s showcase if it isn't there, so it can be previewed.
   Diff your file against the neighbor you picked in step 2 — the structure,
   spacing, and class ordering should look like a sibling, not a stranger.
   **Then actually render it** — open it in Storybook or the showcase and
   interact with it (open the menu, toggle the item). Typecheck and lint pass on
   components that throw at runtime: some Base UI parts require a specific parent
   context (e.g. `GroupLabel` needs a `Group` ancestor) and crash only when
   rendered. See `references/radix-to-base-ui.md` →
   "Context-scoped parts (`GroupLabel`)".

## Required component conventions

Replicate these exactly as the existing components do — do not omit or substitute.

- **`data-slot` on every part.** Each wrapper sets `data-slot="<name>"` on the
  primitive it renders (`data-slot="button"`). Multi-part components set one per
  sub-part (`accordion`, `accordion-item`, `accordion-trigger`,
  `accordion-content`). Cross-component selectors depend on these
  (`in-data-[slot=button-group]:…`, `has-data-[icon=inline-start]:…`,
  `**:data-[slot=kbd]:…`), so a missing `data-slot` silently breaks styling
  elsewhere.

- **Focus / invalid / press patterns.** Interactive components use
  `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`,
  the aria-invalid treatment (`aria-invalid:border-destructive
  aria-invalid:ring-3 aria-invalid:ring-destructive/20` plus the `dark:`
  variants), and the press effect `active:not-aria-[haspopup]:translate-y-px`.
  Copy these from `button.tsx` verbatim where applicable.

- **Radius via the scale.** Use `rounded-lg` or
  `rounded-[min(var(--radius-md),Npx)]` tokens from the custom radius scale.
  **Never** hardcode a px/rem radius or use a raw Tailwind radius value that
  bypasses `--radius`.

- **`color-mix` hover tints.** Hover/active tints use token opacity
  (`bg-primary/80`) or
  `color-mix(in oklch, var(--token), var(--foreground) 5%)`. **Never** introduce
  a new literal color for a state.

- **Icon sizing.**
  `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  scaled down per size variant (e.g. `size-3.5` on `sm`). Icons come from
  `lucide-react`.

- **CVA + `cn()` pattern.** Define variants with `cva()`, then a thin wrapper
  that does `cn(myVariants({ variant, size, className }))`. Export both the
  component and the `…Variants` object. `cn()` is imported from
  `@workspace/ui/lib/utils`.

## Brand tokens are LOCKED — never let `shadcn add` touch them

`shadcn add` may try to rewrite `packages/ui/src/styles/globals.css` or propose a
neutral palette. **Discard those changes.** This repo's brand is intentional:

- **Primary = amber/gold**, not neutral (`--primary: oklch(0.852 0.199 91.936)`
  light / `oklch(0.795 0.184 86.047)` dark).
- **Charts = teal/cyan ramp** (`--chart-1`…`--chart-5`).
- **Font = Inter Variable**; **radius scale** is a multiplicative scale off
  `--radius: 0.625rem`.

If the only change a component needs is a token that genuinely doesn't exist yet,
add it to `:root`/`.dark` **and** wire it into the `@theme inline` block in
`globals.css` — don't inline a literal color. Flag any token change to the user
before making it. See CLAUDE.md for the full locked-token list.

## What "done" looks like

- File uses `@base-ui/react` primitives only — zero `@radix-ui/*` imports.
- Every part has a `data-slot`; focus/invalid/press/icon conventions present.
- No hardcoded radii, no literal state colors, no stock-neutral classes.
- `npm run typecheck -w @workspace/ui` passes.
- Side-by-side with its closest neighbor, it reads like the same author wrote it.
