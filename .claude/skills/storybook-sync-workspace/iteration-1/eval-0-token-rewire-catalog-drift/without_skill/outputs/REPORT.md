# Drift report (BASELINE, no skill)

### button.stories.tsx
- **STALE — `CssVariables` colorTokens (lines 182-203):** Listed `--primary` as "Default variant background" and `--primary-foreground` as "Default variant text". The default variant now reads `--button-bg` / `--button-fg` / `--button-bg-hover` (button.tsx:11). Catalog named the wrong tokens and omitted `--button-bg-hover`.

### colors.stories.tsx
- **`GROUPS` catalog + docblock:** Docblock promises "every color token exposed via the `@theme inline` block." components.css:45-53 now exposes six new keys, but no group displayed them — catalog incomplete vs its own stated contract.

### Pre-existing gaps (NOT introduced by this change — left untouched per surgical scope)
- **button.stories.tsx radius list** references `--radius-md`/`--radius-lg` but not `--button-radius`, which the cva consumes via `rounded-(--button-radius)`. Predates the move; flagging only.
- **badge.stories.tsx** has no `CssVariables`/token-reference story at all (Button has one, Badge never did). Adding one would be net-new scope, not a sync of the stated change, so did not invent it.

### Files edited
- **button.stories.tsx** — replaced the two `--primary*` entries with `--button-bg`, `--button-fg`, `--button-bg-hover`.
- **colors.stories.tsx** — added a "Component" group exposing `button`/`button-hover`/`badge`/`badge-hover` swatches.

(Did not update the colors docblock prose. Did not add a badge token-reference story or fix the button radius row — deliberately scoped out as pre-existing.)
