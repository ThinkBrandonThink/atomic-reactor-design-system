# Theming Architecture (Design Doc)

> Status: **proposal** — no code changed yet. This documents the token contract,
> file layout, and consumer workflow for a deep, per-component theming system.

## Goal

Let consumers (e.g. an LMS host app, a specific school district) restyle the
design system at three levels of breadth, **without forking or rebuilding
`@workspace/ui`**:

1. **Whole-system rebrand** — change the brand and everything follows
   (this already works today via `.dark`; a `.theme-acme` class is identical).
2. **Per-component theming** — restyle buttons _without_ affecting inputs, etc.
   (this is the new capability).
3. **Per-instance overrides** — already supported via `className` + `cn()`.

## The three token tiers

```
Primitives        --color-amber-500, --spacing        raw scales, static
      ↓ referenced by
Semantic / global --primary, --background, --border    brand intent
      ↓ referenced by
Component tokens  --button-bg, --input-border          per-component knobs  ← NEW
      ↓ consumed by
Components         bg-button, border-input-border       cva class strings
```

Today components skip the bottom tier and read semantic tokens directly
(`button.tsx` uses `bg-primary`; `input.tsx` uses `border-input`). That is why a
button can't currently be themed independently of an input. The component-token
tier adds one level of indirection that defaults to the semantic tier but can be
overridden in isolation.

## Decisions locked for this design

| Decision    | Choice                        | Rationale                                                               |
| ----------- | ----------------------------- | ----------------------------------------------------------------------- |
| Granularity | **Common knobs only**         | Small, stable public API; long-tail handled by `className`.             |
| Scoping     | **Class-based, like `.dark`** | Reuses the existing `@custom-variant dark` mechanism; composes & nests. |
| Rollout     | **Design doc first**          | Lock the contract before touching components.                           |

## The "common knobs" set

Each themeable component exposes a fixed, predictable set of tokens. Not every
component uses every knob — only define the ones the component actually renders.

| Knob                   | Token suffix | Example             |
| ---------------------- | ------------ | ------------------- |
| Background             | `-bg`        | `--button-bg`       |
| Foreground (text/icon) | `-fg`        | `--button-fg`       |
| Border                 | `-border`    | `--input-border`    |
| Radius                 | `-radius`    | `--button-radius`   |
| Focus ring             | `-ring`      | `--input-ring`      |
| Hover background       | `-bg-hover`  | `--button-bg-hover` |

**Naming convention (the public contract):**

```
--{component}-{knob}[-{state}]
```

- `{component}` is the `data-slot` name (`button`, `input`, `card`, …).
- States are suffixes: `-hover`, `-active`, `-disabled`.
- Keep it flat. No per-variant tokens (see below).

## How variants relate to component tokens

Components like `Button` have variants (`default`, `outline`, `secondary`,
`ghost`, `destructive`, `link`). To keep the surface small, component tokens
describe the **primary/default appearance only**:

- `--button-bg` / `--button-fg` / `--button-bg-hover` theme the **default**
  (primary) button.
- `secondary`, `outline`, `ghost` keep referencing their **semantic** tokens
  (`--secondary`, `--muted`, …), which are already themeable at the global tier.
- `destructive` keeps referencing `--destructive` (themeable globally).

**Consequence (document this for consumers):** to restyle the primary button,
override `--button-*`. To restyle _secondary_ buttons, override the global
`--secondary` — which also affects other secondary surfaces. Variant-level
isolation (`--button-secondary-bg`) is intentionally **out of scope** for the
common-knobs API; it's the "exhaustive" path we deliberately did not take.

## File layout

```
packages/ui/src/styles/
  globals.css            orchestrator: @imports, @custom-variant, @source, @layer base
  primitives.css         @theme  — brand raw scales (optional first step)
  semantic.css           :root/.dark tokens + @theme inline mapping (the LOCKED brand tokens)
  components.css         component-token defaults + @theme inline mapping  ← NEW
```

`globals.css` imports them in order (CSS requires all `@import`s first, before
`@custom-variant`/`@source`/`@layer`):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@import "./semantic.css";
@import "./components.css";

@custom-variant dark (&:is(.dark *));
@source "...";
@layer base {
  /* resets */
}
```

> Splitting files also _protects the locked brand tokens_: a tool that
> regenerates `globals.css` (e.g. `shadcn add`) won't touch `semantic.css`.

## The `@theme` vs `@theme inline` rule (critical)

This is the non-obvious Tailwind v4 detail that makes theming work:

- **Static tokens** (primitives) → `@theme`. Emits utilities **and** a `:root`
  variable you can reference.
- **Runtime-swappable tokens** (semantic + component tokens, re-pointed by a
  `.dark` or `.theme-*` class) → **`@theme inline`**.

Why `inline` is mandatory for anything a theme class overrides: without it,
`bg-button` compiles to `background: var(--color-button)` — a _fixed_ reference
that a `.theme-acme` override of `--button-bg` never reaches. With `inline`,
`bg-button` compiles to `background: var(--button-bg)`, so the class override
flows through the cascade. (Same reason the existing `:root`/`.dark` block uses
`@theme inline`.)

## Worked example — `components.css`

```css
:root {
  /* button (primary appearance) */
  --button-bg: var(--primary);
  --button-fg: var(--primary-foreground);
  --button-bg-hover: color-mix(
    in oklch,
    var(--button-bg),
    var(--foreground) 20%
  );
  --button-radius: var(--radius-lg);
  --button-ring: var(--ring);

  /* input */
  --input-bg: transparent;
  --input-fg: var(--foreground);
  --input-border: var(--input);
  --input-radius: var(--radius-lg);
  --input-ring: var(--ring);
}

@theme inline {
  --color-button: var(--button-bg);
  --color-button-fg: var(--button-fg);
  --color-button-hover: var(--button-bg-hover);
  --color-button-ring: var(--button-ring);

  --color-input-surface: var(--input-bg);
  --color-input-fg: var(--input-fg);
  --color-input-border: var(--input-border);
  --color-input-ring: var(--input-ring);
}
```

Component diffs this enables (illustrative):

```diff
- // button.tsx default variant
- default: "bg-primary text-primary-foreground hover:bg-primary/80",
+ default: "bg-button text-button-fg hover:bg-button-hover",

- // input.tsx
- "... rounded-lg border border-input bg-transparent ..."
+ "... rounded-[--input-radius] border border-input-border bg-input-surface ..."
```

Radius knobs that aren't colors use the arbitrary-property syntax
(`rounded-[--button-radius]`) rather than a `@theme` color mapping.

## Consumer workflow (the LMS app)

A consuming app already imports the stylesheet once:

```ts
import "@workspace/ui/globals.css"
```

To add a theme, the consumer writes their **own** CSS file — they never touch
the package:

```css
/* lms-app/src/themes/district-42.css */
.theme-district-42 {
  /* broad: rebrand everything */
  --primary: oklch(0.55 0.18 250);

  /* narrow: only primary buttons */
  --button-radius: 9999px; /* pill buttons; inputs stay rounded */
  --button-bg-hover: color-mix(in oklch, var(--button-bg), black 12%);

  /* narrow: only input borders */
  --input-border: oklch(0.5 0.02 250);
}
```

Apply by toggling the class on any scope:

```html
<div class="theme-district-42">...themed subtree...</div>
<!-- or on <html> for the whole app -->
```

Because these are CSS variables resolved in the _consumer's_ DOM, themes:

- **compose** with `.dark` (`<html class="dark theme-district-42">`),
- **nest** (a `.theme-district-42` subtree inside a default page),
- and require **no rebuild** of `@workspace/ui`.

For changes beyond tokens (layout, one-off shadows, fonts on just buttons),
consumers use `className` per-instance, or target `[data-slot="button"]` in
their own CSS — that surface is intentionally not tokenized.

## Stability contract

Every component token is a **public API**. Once a consumer depends on
`--button-bg`, renaming or removing it is a breaking change. Therefore:

- Treat the knob list as versioned API; add freely, remove only on major bumps.
- Keep names derived mechanically from `data-slot` + the knob table so they stay
  predictable and self-documenting.

## Open questions before implementation

1. Which components are first-class themeable? (Proposal: start with `button`,
   `input`, `card`, `badge`, `field`.)
2. Do we extract a `primitives.css` brand-scale tier now, or keep literal oklch
   values in `semantic.css` and add component tokens only? (Latter is the
   smaller first step.)
3. Should there be a published "theme template" file in the repo that consumers
   copy as a starting point?
