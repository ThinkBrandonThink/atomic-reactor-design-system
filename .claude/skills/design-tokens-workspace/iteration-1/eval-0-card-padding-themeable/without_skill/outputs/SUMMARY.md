# Summary — Make card inner padding themeable per-theme

## Goal
Allow a theme to adjust the card's inner padding without affecting buttons or
anything else in the system.

## Problem
Card inner padding was driven by `--card-spacing`, but that token was **defined
inline in the component** (`[--card-spacing:--spacing(4)]` on the root card, with
`data-[size=sm]:[--card-spacing:--spacing(3)]`). Because the value lived in the
component className, there was no token in the public theming API (tier 3,
`components.css`) for a `.theme-*` file to override. A consumer could not retune
card padding without editing the component source.

## Changes

### 1. styles/components.css (tier 3 — component knobs / public theming API)
Added a new card-only component token:

    /* Card */
    --card-radius: var(--radius-xl);
    /* Inner padding (px/py + gap). Default mirrors the previous inline
       --spacing(4); the `sm` size overrides it to --spacing(3) in card.tsx. */
    --card-padding: calc(var(--spacing) * 4);

- `calc(var(--spacing) * 4)` resolves to exactly what `--spacing(4)` expanded to
  before (Tailwind v4's `--spacing` base is `0.25rem`, so `* 4` = `1rem`), so the
  default rendering is byte-identical.
- Added a scope note in the file header explaining that `--card-padding` is a
  card-only knob and no other component references it.

### 2. components/card.tsx
Changed the root card's internal `--card-spacing` to seed from the new themeable
token instead of a hardcoded value:

    - [--card-spacing:--spacing(4)]
    + [--card-spacing:var(--card-padding)]

The `sm` size override (`data-[size=sm]:[--card-spacing:--spacing(3)]`) is left as
a local override, exactly as before. All card sub-slots (CardHeader, CardContent,
CardFooter) continue to read `--card-spacing`, which now inherits from
`--card-padding` — so the single `--card-padding` knob drives px, py, and gap
across the whole card.

### 3. styles/themes/_template.css
Documented the new knob in the consumer-facing template, next to `--card-radius`:

    /* --card-padding: 1.5rem;      inner spacing of cards (24px). Bigger = roomier */

## Why this is correctly scoped
- `--card-padding` (and `--card-spacing`) are referenced **only** by card.tsx —
  verified via grep across all components. Buttons, inputs, and badges have their
  own tier-3 tokens (`--button-*`, `--badge-*`, `--input-radius`) and never touch
  card padding, so overriding `--card-padding` cannot affect them.
- The change follows the existing three-tier pattern: the component reads a tier-3
  knob in components.css that defaults to the previous value, mirroring how
  `--card-radius` already works.
- No color value or contrast is involved, so no WCAG check was needed.

## Verification
- grep confirmed `--card-spacing` / `--card-padding` are referenced only in
  card.tsx and components.css (no other component file uses them).
- Default value `calc(var(--spacing) * 4)` equals the prior `--spacing(4)` (1rem),
  so unthemed cards render unchanged; the `sm` variant still uses `--spacing(3)`.
- To use: a `.theme-*` file sets e.g. `--card-padding: 1.5rem;` and every card's
  inner padding/gap updates, with no effect on other components.
