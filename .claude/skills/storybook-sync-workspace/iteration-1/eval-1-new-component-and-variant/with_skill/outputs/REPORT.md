# Report (WITH skill)

### badge.stories.tsx — variant drift
`cva` in badge.tsx defines a `premium` variant (badge.tsx:26-27) the story didn't document:
- **MISSING** — `argTypes.variant.options` omitted `"premium"`. Added between `ghost` and `link` to match cva ordering.
- **MISSING** — `Variants` story rendered 9 of 10 variants. Added a `<Badge variant="premium">` between Ghost and Link.

### callout.stories.tsx — missing story
- **MISSING STORY** — `callout.tsx` exists (variants info/warning/destructive, default info) but had no `*.stories.tsx` sibling, so the glob never picked it up. Created `callout.stories.tsx` with `Default` and `Variants` stories covering all three variants, argTypes options listing all three, and `args.variant: "info"` matching the default.

### Clean (no drift from this change)
- colors/icons foundation catalogs — untouched by this change.
- No CssVariables token-reference tables involved.

### Files edited / created
- **badge.stories.tsx** — added `premium` to argTypes options and to the Variants render.
- **callout.stories.tsx** — new story (Default + Variants for info/warning/destructive).
