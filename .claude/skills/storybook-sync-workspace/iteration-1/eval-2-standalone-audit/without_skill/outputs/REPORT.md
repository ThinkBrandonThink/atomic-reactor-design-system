# Storybook drift audit (BASELINE, no skill)

Scope: three-tier token reorg. Checked all 58 `*.stories.tsx`. Only `colors.stories.tsx` and `button.stories.tsx` reference tokens; rest document structure/variants. Variant/arg lists for token-adjacent components (button, badge) still match their cva.

### button.stories.tsx — STALE (fixed)
`CssVariables` reference story documented the button's tokens as they were *before* tier-3 knobs:
- button.tsx:11 — default variant is `bg-button text-button-fg hover:bg-button-hover` (= `--button-bg`/`--button-fg`/`--button-bg-hover`, components.css:27-29), not `--primary`/`--primary-foreground`.
- button.tsx:6 — base radius is `rounded-(--button-radius)`, not direct `--radius-lg`.
- Omission: link variant (`text-primary-link`) undocumented; `--primary-link` missing.

Fix: replaced `--primary`/`--primary-foreground` with `--button-bg`/`--button-fg` + added `--button-bg-hover`; replaced `--radius-lg` row with `--button-radius`; added `--primary-link` row.

### colors.stories.tsx — CURRENT (no change)
Docblock correctly describes all three tiers + files; "Component tokens" group lists all six `--button-*`/`--badge-*` tokens. Radius knobs intentionally absent (color catalog). No drift.

### Other stories — CURRENT
- icons.stories.tsx uses valid `--radius-lg`; not drift.
- card/input/badge reference no tokens and variant lists match.

### Files edited
- **button.stories.tsx** — updated `colorTokens`/`radiusTokens` arrays to the tier-3 knobs (`--button-bg`, `--button-fg`, `--button-bg-hover`, `--button-radius`) + added `--primary-link` row.

NOTE: did NOT catch the `icon-xs` size missing from argTypes.size.options.
