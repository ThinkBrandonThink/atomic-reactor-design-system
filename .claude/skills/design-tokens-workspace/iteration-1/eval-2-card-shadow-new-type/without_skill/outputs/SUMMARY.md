# Card drop shadow — summary

## Goal
Give cards a subtle drop shadow that is tunable later and reads correctly in dark mode.

## Approach
A shadow is a new token *type*, so I threaded it through the existing three-tier
token architecture (raw primitive -> semantic role -> component knob) rather than
hard-coding a shadow utility on the component.

## Changes

### 1. styles/primitives.css (tier 1 — raw palette)
Added a raw shadow tint `--shadow-color: oklch(0 0 0);`. Pure black; alpha/blur
are composed at the semantic tier so light and dark can diverge.

### 2. styles/semantic.css (tier 2 — role + light/dark)
Added a `--shadow-card` role token in both `:root` and `.dark`, the tier where
light vs dark is defined:
- Light: soft, low-alpha two-layer shadow (5% / 10%).
- Dark: deeper alpha + blur (30% / 45%), because near-black shadows are almost
  invisible on dark surfaces. Built with
  `color-mix(in oklab, var(--shadow-color) N%, transparent)`.

### 3. styles/components.css (tier 3 — public theming knob)
Added `--card-shadow: var(--shadow-card);`. No @theme mapping needed — like
`--card-radius`, it is consumed via the arbitrary-property syntax
`shadow-(--card-shadow)`, which also avoids a name collision with the semantic
`--shadow-card`.

### 4. components/card.tsx
Added `shadow-(--card-shadow)` to the root Card class list, mirroring the
existing `rounded-(--card-radius)` pattern. One token added, nothing else touched.

### 5. styles/themes/_template.css
Documented the knob for consumers (with "none" to remove the shadow).

## Resolution chain
--shadow-color (primitive) -> --shadow-card (semantic, per light/dark) ->
--card-shadow (component knob) -> shadow-(--card-shadow) (card.tsx).

## Verification
- Grepped all shadow references across styles/ and card.tsx to confirm the
  three-tier chain resolves with no circular reference and no duplicate
  --shadow-card Tailwind theme key.
- Confirmed shadow-(--token) is the same Tailwind v4 arbitrary-property form the
  card already uses for rounded-(--card-radius).
- No build/test runner exists for standalone packages/ui (Vite resolves source
  directly), so verification was static: token-chain trace + pattern parity.
