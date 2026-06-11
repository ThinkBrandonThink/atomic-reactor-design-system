# Make card inner padding themeable per theme

## Goal
The card's inner padding should be adjustable per theme without affecting
buttons or anything else.

## Diagnosis
Card padding/gap is driven by the `--card-spacing` custom property, consumed in
`card.tsx` via `p-(--card-spacing)`, `py-(--card-spacing)`, `gap-(--card-spacing)`,
and `px-(--card-spacing)`. The problem: its default was set **inline on the card
element** (`[--card-spacing:--spacing(4)]`). An inline custom property on the
component itself wins over anything a `.theme-*` class sets on `:root`, so a
consumer theme could not override it. Padding was therefore not themeable.

This is the spacing case in the design-tokens skill
(`references/token-types.md` section 3): a card padding knob belongs in tier 3
(`components.css`) as a bare custom property defaulted with the `--spacing()`
function, consumed via the `p-(--token)` arbitrary-property syntax — not baked
inline.

## Changes (by tier)

### Tier 3 — component knobs (styles/components.css)
- Added `--card-spacing: --spacing(4);` to the `:root` Card block, next to the
  existing `--card-radius`. Promotes card padding to a public per-component knob
  with the identical default value, so visual behavior is unchanged until a theme
  overrides it.
- Spacing is a layout knob, so it needs NO `@theme inline` `--color-*` mapping
  (that namespace is colors only). It is consumed via the existing
  `p-/py-/gap-/px-(--card-spacing)` arbitrary syntax.
- Updated the file's scope-note comment to record that card radius and inner
  padding are the exposed card knobs.

### Component (components/card.tsx)
- Removed the inline `[--card-spacing:--spacing(4)]` default from the Card
  element's class. The token now resolves to the tier-3 default in
  components.css, which a `.theme-*` class can override.
- Kept `data-[size=sm]:[--card-spacing:--spacing(3)]` untouched — the small-size
  variant still locally tightens padding on top of the new themeable default.

### Consumer theme template (styles/themes/_template.css)
- Added a commented, optional `--card-spacing` line under the "Cards" section so
  consumers discover the knob:
  `/* --card-spacing: 1.5rem;     inner padding/gap; bigger = roomier cards */`.

## Why this is correct per the skill's one rule
- The knob lives in tier 3 (components.css) and defaults to a base spacing value
  via the Tailwind `--spacing()` function (no downward/peer reference).
- It is scoped to the card only — buttons, badges, inputs, fields untouched, so
  overriding `--card-spacing` in a theme cannot affect them.
- No primitive or locked brand token touched; no color value introduced (so the
  color-tokens skill was not needed).

## How a theme now overrides it
A consumer `.theme-*` class (e.g. in `themes/<name>.css`) can set
`--card-spacing: 1.5rem;` (or any length). Because the default now lives on
`:root` via components.css instead of inline on the element, the theme's
`:root`-scoped value wins, restyling card padding system-wide while leaving every
other component at its own spacing.

## Verification (commands run + results)

Full token audit of the sandbox styles dir:

    $ python3 .claude/skills/design-tokens/scripts/check_tokens.py <sandbox>/styles
    Atomic Reactor token audit — primitives -> semantic -> components -> themes
      . 29 primitives, 36 semantic roles, 11 component knobs, 41 --color-* utility mappings.
    OK — 0 errors, 0 warning(s).
    EXIT: 0

Consumer-theme validation of the updated template (confirms --card-spacing is a
recognized public knob, not a no-op / internal override):

    $ python3 .claude/skills/design-tokens/scripts/check_tokens.py <sandbox>/styles \
        --theme <sandbox>/styles/themes/_template.css
    Validating consumer theme: .../themes/_template.css
    OK — 0 errors, 0 warning(s).
    EXIT: 0

Both pass with exit 0.

## Files changed
- styles/components.css
- components/card.tsx
- styles/themes/_template.css
