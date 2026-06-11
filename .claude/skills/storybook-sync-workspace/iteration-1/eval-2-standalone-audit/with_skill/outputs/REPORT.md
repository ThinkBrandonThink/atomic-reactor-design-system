# Drift audit (WITH skill)

Scope: full sweep. Source of truth = `--color-*` mappings in `@theme inline` across `semantic.css` + `components.css`, plus each component's `cva`. Missing-story check: none (every `*.tsx` has a `*.stories.tsx` sibling).

### button.stories.tsx — DRIFTED (3 findings)
Button rewired to tier-3 knobs (`--button-bg/-fg/-hover` in components.css:27-29, `rounded-(--button-radius)` in button.tsx:7) and gained an `icon-xs` size (button.tsx:29), but the story didn't follow:
- STALE — `argTypes.size.options` missing `icon-xs` which exists in the cva. The `IconOnly` render never showed it.
- STALE — `CssVariables` colorTokens listed `--primary`/`--primary-foreground` as default bg/text, but button.tsx:11 uses `bg-button`/`text-button-fg`/`hover:bg-button-hover`. Missing `--button-bg`, `--button-fg`, `--button-bg-hover`, and the link variant's `--primary-link`.
- STALE — radiusTokens claimed `--radius-lg` drives default/lg/icon corners, but component references `--button-radius`.

### In sync — no changes needed
- **colors.stories.tsx** — GROUPS covers every catalog-able token; tier-3 knobs correctly in "Component tokens" group; docblock accurate. No drift.
- **badge.stories.tsx** — all 9 cva variants present. `--badge-*` knobs have no token-reference story (matches existing convention).
- **icons.stories.tsx** — iconAttributes/svgDefaults still match lucide defaults.
- **card.tsx / input.tsx** — no cva variants and no token-reference stories, so new `--card-radius`/`--input-radius` introduce no story drift (flaggable, not required).

### Files edited
- **button.stories.tsx** — added `icon-xs` to size argTypes + IconOnly render; replaced stale `--primary`/`--primary-foreground` rows with `--button-bg`/`--button-fg`/`--button-bg-hover` + added `--primary-link`; updated radius row to `--button-radius`.
