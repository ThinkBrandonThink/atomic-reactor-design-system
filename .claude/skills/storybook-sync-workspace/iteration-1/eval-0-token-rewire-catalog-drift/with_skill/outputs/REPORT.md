# Drift report (WITH skill)

### colors.stories.tsx
- **MISSING (catalog):** The 6 component color tokens exposed in `components.css` `@theme inline` (`--button-bg`, `--button-fg`, `--button-bg-hover`, `--badge-bg`, `--badge-fg`, `--badge-bg-hover`) had no swatches — `GROUPS` ended at "Sidebar" with no "Component tokens" group. These are tier-3 knobs and must live in their own group, not mixed with semantic roles.
- **STALE (docblock):** Top JSDoc said tokens come from the `@theme inline` block in `globals.css`. Tokens now live across `semantic.css` (roles) and `components.css` (component knobs); `globals.css` only imports them. Also fixed the `docs.description` prose.

### button.stories.tsx
- **STALE (CssVariables / colorTokens):** Rows listed `--primary` as "Default variant background" and `--primary-foreground` as "Default variant text", but button.tsx:11 now uses `bg-button text-button-fg hover:bg-button-hover`. The default variant's hover token was also undocumented.
- **STALE (CssVariables / radiusTokens):** Row listed `--radius-lg` for default/lg/icon corners, but button.tsx:7 uses `rounded-(--button-radius)`.

### badge.stories.tsx
- **MISSING (token-reference story):** Badge gained dedicated `--badge-bg/-fg/-hover` (and pre-existing `--badge-radius`) tokens but had no `CssVariables` story. Added one mirroring button's pattern.
- Variants/args (9 variants) were already in sync.

### Files edited
- **colors.stories.tsx** — added a "Component tokens" group; updated docblock + docs.description to reference `semantic.css` + `components.css` instead of `globals.css`.
- **button.stories.tsx** — replaced stale `--primary`/`--primary-foreground` rows with `--button-bg`/`--button-fg`/`--button-bg-hover`; replaced `--radius-lg` row with `--button-radius`.
- **badge.stories.tsx** — added a `CssVariables` story (+ helpers) documenting `--badge-bg/-fg/-bg-hover`, per-variant tokens, and `--badge-radius`.

(Could not run tsc/build — deps not installed in snapshot; verified by re-reading against component classes.)
