# Report (BASELINE, no skill)

### badge.stories.tsx
Badge gained a `premium` variant (badge.tsx:26-27) the story did not document:
- **argTypes.variant.options** — missing `"premium"`; select control couldn't reach it.
- **Variants story render** — listed default/secondary/destructive/warning/success/info/outline/ghost/link but no `premium` swatch.

### callout.stories.tsx
- **Missing entirely.** New `Callout` component shipped with no story. Its cva defines info (default)/warning/destructive (callout.tsx:10-14), none documented.

### Files edited / created
- **badge.stories.tsx** — added `"premium"` to the variant select options and a `<Badge variant="premium">` swatch.
- **callout.stories.tsx** — new story: meta with variant select (info/warning/destructive), Default story, Variants story rendering all three with icons, matching alert.stories.tsx / badge.stories.tsx conventions.

Note: uncertain whether lucide-react resolves in this snapshot (dist empty), so used icons with existing precedent (InfoIcon, AlertTriangleIcon) plus standard XCircleIcon.
