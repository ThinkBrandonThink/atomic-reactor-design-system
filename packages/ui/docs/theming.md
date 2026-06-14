# Theming Architecture

> Status: **implemented**. The three-tier token system below is live in
> `packages/ui/src/styles/`. This documents the token contract, file layout, and
> consumer workflow for deep, per-component theming.

## Goal

Let consumers (e.g. an LMS host app, a specific school district) restyle the
design system at three levels of breadth, **without forking or rebuilding
`@workspace/ui`**:

1. **Whole-system rebrand** — change the brand and everything follows
   (works via `.dark` today; a `.theme-acme` class is identical).
2. **Per-component theming** — restyle buttons _without_ affecting inputs.
3. **Per-instance overrides** — via `className` + `cn()`.

Levels 1–2 are the **curated token API** (a fixed, hex-friendly knob list — safe
for non-technical themers). For technical consumers who need to change a property
the token list doesn't expose — e.g. the border of _secondary_ buttons
specifically — there is a fourth, open-ended level:

4. **Per-variant custom CSS** — target a component's stable `data-slot` /
   `data-variant` / `data-size` attributes from your own stylesheet and set _any_
   CSS property. See [Per-variant styling hooks](#per-variant-styling-hooks-data--attributes).

## The three token tiers

```
Primitives        --brand-400, --neutral-900          raw palette, static     → primitives.css
      ↓ referenced by
Semantic / global --primary, --background, --border    brand intent            → semantic.css
      ↓ referenced by
Component tokens  --button-bg, --button-radius         per-component knobs      → components.css
      ↓ consumed by
Components         bg-button, rounded-(--button-radius) cva class strings
```

Each tier defaults to the one above it, so behaviour is identical until a token
is overridden — and an override at any tier is scoped to exactly that breadth.

## File layout

```
packages/ui/src/styles/
  globals.css            orchestrator: @imports, @custom-variant, @source, @layer base
  primitives.css         raw palette — plain :root custom properties
  semantic.css           :root/.dark semantic tokens + the @theme inline mapping (LOCKED brand tokens)
  components.css         component-token defaults + @theme inline color mapping
  themes/_template.css   copy-paste starting point for a consumer theme
```

`globals.css` imports the tiers in order (CSS requires all `@import`s before any
other rule):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@import "./primitives.css";
@import "./semantic.css";
@import "./components.css";

@custom-variant dark (&:is(.dark *));
@source "...";
@layer base {
  /* resets */
}
```

> Splitting files also _shields the locked brand tokens_: a tool that
> regenerates `globals.css` (e.g. `shadcn add`) can't reach `semantic.css`.

## Tier 1 — primitives (`primitives.css`)

Named, deduplicated raw values: `--neutral-*`, `--brand-*`, and status hues
(`--red-*`, `--green-*`, `--amber-*`, `--blue-*`). Shade numbers approximate
lightness, Tailwind-style.

**Deliberately plain `:root` custom properties — NOT a Tailwind `@theme` block.**
Two reasons:

1. **No namespace collision.** Tailwind ships its own `--color-teal-*`,
   `--color-neutral-*`, etc. Defining ours under `@theme` as `--color-*` would
   silently override Tailwind's scales. Plain names (`--gold-300`) can't collide.
2. **Primitives stay internal.** Plain custom properties generate no
   `bg-gold-300` utilities, so nothing tempts a component or consumer to reach
   past the semantic tier. Primitives are an implementation detail, not API.

The chart ramp (`--chart-1..5`) is a curated, non-uniform scale and is kept as
literals in `semantic.css` rather than decomposed into primitives.

## Tier 2 — semantic (`semantic.css`)

The shadcn-style role tokens (`--primary`, `--background`, `--border`, …) in
`:root` / `.dark`, each referencing a primitive. Light vs dark is defined here:
the same names take different primitive shades under `.dark`. The locked brand
tokens (amber primary, teal charts, radius scale, Inter font) live here.

The `@theme inline` mapping (`--color-primary: var(--primary)`, the `--radius-*`
scale, `--font-heading`) also lives here, alongside a small plain `@theme` block
for `--font-sans` — see the `inline` rule below for why the two fonts sit in
different blocks.

### Typography knobs

Typography is themeable through tokens that already exist (no new component-tier
tokens were added):

| Knob | Overrides | Default |
| --- | --- | --- |
| `--font-sans` | the font for body text **and** headings | `"Inter Variable", sans-serif` |
| `--font-heading` | headings only (set it _in addition_ to `--font-sans` to diverge; otherwise it aliases `--font-sans`) | `var(--font-sans)` |
| `--text-xs` … `--text-4xl` | individual font sizes (Tailwind's scale) | `0.75rem` … `2.25rem` |
| `--font-weight-normal/medium/semibold` | font weights | `400` / `500` / `600` |

Because components write the plain Tailwind utilities (`text-sm`, `font-medium`,
`font-heading`), overriding these `:root`-level tokens in a `.theme-*` class
restyles every component at once.

## Tier 3 — component tokens (`components.css`) — PUBLIC API

The new tier. Each token defaults to a semantic token; override one to restyle a
single component in isolation.

**Naming:** `--{component}-{knob}[-{state}]`, where `{component}` is the
`data-slot` name. Knob vocabulary: `-bg`, `-fg`, `-border`, `-radius`, `-ring`,
`-bg-hover`.

The implemented set is deliberately minimal — only the genuinely-missing knobs:

| Component | Tokens added                                          | Why only these |
| --------- | ----------------------------------------------------- | -------------- |
| Button    | `--button-bg`, `--button-fg`, `--button-bg-hover`, `--button-radius` | bg/fg/hover shared `--primary` with badge, so they couldn't diverge. |
| Badge     | `--badge-bg`, `--badge-fg`, `--badge-bg-hover`, `--badge-radius`     | same — separated from button. |
| Input     | `--input-radius`                                      | bg/border already theme via `bg-transparent` / the `--input` semantic token. |
| Card      | `--card-radius`                                       | bg/fg already theme via the `--card` / `--card-foreground` semantic tokens. |
| Field     | _(none)_                                              | layout component; its only colors are validation/checked states that should track global semantics. |

Color tokens are mapped into Tailwind's `--color-*` namespace (`@theme inline {
--color-button: var(--button-bg) }`) so `bg-button` / `text-button-fg` exist.
Radius tokens need no mapping — components consume them via the
`rounded-(--button-radius)` arbitrary-property syntax.

### How variants relate

Component tokens describe the **default/primary appearance only**. A button's
`secondary`/`outline`/`ghost`/`destructive` variants keep referencing their
semantic tokens (`--secondary`, `--muted`, `--destructive`), which are themeable
at the global tier. So: override `--button-bg` to restyle primary buttons;
override `--secondary` to restyle secondary buttons (which also affects other
secondary surfaces). Variant-level isolation is intentionally out of scope.

## The `@theme` vs `@theme inline` rule (critical)

The real rule that makes runtime theming work:

> A utility is runtime-themeable **iff it compiles to `var(--something)` where
> `--something` is a custom property that lives in `:root`** (so a `.dark` /
> `.theme-*` class can override it through the cascade). If the utility compiles
> to a baked literal, no override can reach it.

Tailwind v4 gives two ways to land on that referenced form — and one trap:

| Token value | Block | Compiles to | Themeable |
| --- | --- | --- | --- |
| a `var()` reference, e.g. `--color-primary: var(--primary)` | `@theme inline` | `background: var(--primary)` | ✅ — the inline value (itself a var) is forwarded; override `--primary` |
| a **literal**, e.g. `--font-sans: "Inter Variable", sans-serif` | **plain `@theme`** | `font-family: var(--font-sans)` | ✅ — non-inline emits `--font-sans` to `:root` and references it |
| a **literal** | `@theme inline` ← **trap** | `font-family: Inter Variable, sans-serif` | ❌ — the literal is baked in; no override reaches it |
| a `var()` reference | plain `@theme` ← **trap** | _(token dropped — non-inline registers only concrete values)_ | ❌ |

So the choice is driven by the **value**, not by habit:

- **Primitives** → plain `:root` (not `@theme` at all). Internal values, no utilities.
- **Color tokens** (`--color-primary: var(--primary)`, `--color-button: var(--button-bg)`)
  → **`@theme inline`**, because their value is a `var()` reference.
- **`--font-sans`** → **plain `@theme`**, because its value is a literal. (This also
  makes Tailwind's `--default-font-family`, which drives body text, reference it.)
- **`--font-heading: var(--font-sans)`** → **`@theme inline`**, because its value is a
  `var()` reference (it aliases `--font-sans`).
- **Font sizes / weights / line-heights** (`--text-*`, `--font-weight-*`, `--leading-*`)
  come from Tailwind's own non-inline defaults, already in the referenced form — so
  they are overridable with no extra wiring.

## Consumer workflow (the LMS app)

The app already imports the stylesheet once:

```ts
import "@workspace/ui/globals.css"
```

To theme, the consumer copies `themes/_template.css`, renames the class, and
imports it **after** the design system — never touching the package:

```css
/* lms-app/src/themes/district-42.css */
.theme-district-42 {
  /* broad: rebrand everything */
  --primary: oklch(0.55 0.18 250);

  /* narrow: only primary buttons */
  --button-radius: 9999px; /* pill buttons; inputs stay rounded */

  /* narrow: only input corners */
  --input-radius: 0;
}
```

Apply by toggling the class on any scope:

```html
<div class="theme-district-42">…themed subtree…</div>
<!-- or on <html> for the whole app -->
```

Because these are CSS variables resolved in the _consumer's_ DOM, themes
**compose** with `.dark` (`<html class="dark theme-district-42">`), **nest**, and
need **no rebuild** of `@workspace/ui`.

For changes beyond tokens (layout, one-off shadows, a property on just one
variant), consumers use `className` per-instance or write custom CSS against the
[per-variant styling hooks](#per-variant-styling-hooks-data--attributes) below —
that surface is intentionally not tokenized.

## Per-variant styling hooks (`data-*` attributes)

The token tiers above are a _curated_ surface: a consumer can only change what a
knob exposes, and knobs describe the **default appearance only** (see
[How variants relate](#how-variants-relate)). To restyle one _variant_ or _size_
of a component — or to set a property no knob covers — components emit stable
`data-*` attributes you can target from custom CSS.

This is the surface behind the host app's **"upload custom CSS"** admin option:
the friendly token form (`_template.css`) covers levels 1–2; this covers the
power-user case. A commented starter with the full hook reference and worked
examples ships at `themes/_custom-css.css` — the developer-facing counterpart to
`_template.css`.

### What's targetable

There are two layers:

- **Universal — `data-slot`.** Almost every component (and most of its
  sub-parts) emits `data-slot` — a card exposes `card`, `card-header`,
  `card-footer`; a dialog exposes `dialog-content`, `dialog-title`, etc. So
  _any_ component, or any part of one, is targetable, even those with no
  variants. (The only components without one are non-visual helpers —
  `direction`, `sonner`, `spinner`.)
- **Variant/size — `data-variant` / `data-size`.** Components that offer those
  options also reflect them. The set is broader than the table below: beyond the
  common targets, `data-variant` is also emitted by `empty`, `field`,
  `toggle-group`, and the menu items (`dropdown-menu`, `context-menu`,
  `menubar`, as `default`/`destructive`); `data-size` by `avatar`,
  `alert-dialog`, `card`, `input-group`, `native-select`, `select`, `switch`,
  `toggle-group`. Others expose state/config hooks too (`data-orientation`,
  `data-side`, `data-state`, `data-active`, …).

**To find any component's hooks, inspect the element in dev tools** and target
the `data-*` attributes you see — the rendered element is the source of truth.

### Common targets

The components most often restyled per-variant (not an exhaustive list — see
above). Values are the component's `cva` variant keys:

| Component | `data-slot` | `data-variant` values | `data-size` values |
| --- | --- | --- | --- |
| Button | `button` | `default` `secondary` `outline` `ghost` `destructive` `link` | `default` `xs` `sm` `lg` `icon` `icon-xs` `icon-sm` `icon-lg` |
| Badge | `badge` | `default` `secondary` `destructive` `warning` `success` `info` `outline` `ghost` `link` | — |
| Alert | `alert` | `default` `destructive` | — |
| Toggle | `toggle` | `default` `outline` | `default` `sm` `lg` |
| Item | `item` | `default` `outline` `muted` | `default` `sm` `xs` |
| Sidebar menu button | `sidebar-menu-button` | `default` `outline` | `default` `sm` `lg` |
| Tabs list | `tabs-list` | `default` `line` | — |

Default values are always present (a plain `<Button>` emits `data-variant="default"`),
so a `default`-targeted rule is reliable.

### Usage

Target the slot **and** the variant so the rule can't leak onto another
component that happens to share a variant name:

```css
/* secondary buttons: add a 2px brand border — the original example */
[data-slot="button"][data-variant="secondary"] {
  border-width: 2px;
  border-color: #3b82f6;
}

/* only large buttons */
[data-slot="button"][data-size="lg"] {
  letter-spacing: 0.02em;
}

/* warning badges */
[data-slot="badge"][data-variant="warning"] {
  text-transform: uppercase;
}
```

### Two things to know

1. **Specificity / interactive states.** A `[data-slot][data-variant]` selector is
   specificity (0,2,0) — it beats a single Tailwind utility class (0,1,0), so
   _static_ overrides (border, letter-spacing, a one-off background) win with no
   `!important`. But the components' own **state** styling (`hover:`, `active:`,
   `aria-invalid:`, `focus-visible:`) compiles to selectors of comparable
   specificity that resolve by source order. To override a property the variant
   also changes on hover/active, qualify your rule with the same state — e.g.
   `[data-slot="button"][data-variant="secondary"]:hover { … }`. The relevant
   interactive-state hooks per component: buttons/toggles use the Base UI
   `data-disabled` / `data-pressed` attributes and `aria-invalid`; the sidebar menu
   button additionally emits `data-active`.

2. **This is a stability contract.** The moment a consumer's CSS targets
   `[data-variant="secondary"]`, the `data-slot` name and that variant key are
   public API — see [Stability contract](#stability-contract).

## Stability contract

Every component token **and every styling hook** is a **public API**. Once a
consumer depends on `--button-bg`, or writes CSS against
`[data-slot="button"][data-variant="secondary"]`, renaming or removing that
name is a breaking change. Therefore:

- Treat the knob list as versioned API; add freely, remove only on major bumps.
- Keep token names derived mechanically from `data-slot` + the knob vocabulary.
- `data-slot` values and `cva` variant/size **keys** are part of the contract:
  renaming a variant (e.g. `secondary` → `subtle`) breaks consumer CSS, so treat
  it as a major-version change. (Restyling _what a variant looks like_ is fine —
  only the key is contractual.)

## Extending: making another component themeable

1. Identify the genuinely-missing knobs (skip anything already covered by a
   component-scoped semantic token like `--card`).
2. Add `--{slot}-{knob}` defaults to `components.css`, defaulting to the relevant
   semantic token.
3. For color knobs, add a `--color-{slot}-{knob}: var(--{slot}-{knob})` line to
   the `@theme inline` block.
4. Swap the component's hardcoded utility for the token utility
   (`bg-primary` → `bg-{slot}`, `rounded-xl` → `rounded-(--{slot}-radius)`).
5. Document the new knobs in the table above and the template file.

### Exposing the per-variant styling hooks

A new variant-driven component must also emit `data-variant` / `data-size` (the
[hooks above](#per-variant-styling-hooks-data--attributes)). How depends on how
it renders:

- **Base UI `useRender` components** (e.g. `badge`, `item`, `sidebar-menu-button`):
  include `variant` / `size` in the `state` object. Base UI auto-serializes every
  truthy `state` key to a `data-*` attribute, so `state: { slot, variant, size }`
  emits all three for free — no literal attributes needed.
- **Plain-element / Base UI-primitive components** (e.g. `button`, `toggle`,
  `alert`): there is no `state` object, so add literal `data-variant={variant}` /
  `data-size={size}` attributes next to `data-slot` (the `tabs.tsx` pattern). Give
  the prop a `= "default"` fallback so the default case still emits the hook.

Then add the component's row to the hooks table above.
