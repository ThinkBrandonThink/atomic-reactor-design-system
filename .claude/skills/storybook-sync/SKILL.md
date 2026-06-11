---
name: storybook-sync
description: >-
  Keep the Atomic Reactor Storybook in sync with the code it documents. Use this
  whenever component or design-token code changes and the stories that document
  it might now be stale — after adding/editing a component, after adding/moving/
  rewiring a token (color, radius, spacing, shadow…), or whenever someone asks
  "are the stories up to date?", "did I miss any stories?", "update the stories
  for my changes", "is the colors story current?", or "audit Storybook for
  drift". This is the skill that catches the classic miss: the CSS tokens get
  refactored (e.g. new component-level `--button-bg` knobs) but the colors
  catalog story or a component's "CSS variables" reference story never gets
  updated. It checks four kinds of drift — foundations catalogs (Colors, Icons,
  Typography),
  per-component stories (variants/args vs. the component's cva), missing stories,
  and stale docblock prose — reports what's drifted, and fixes it on your
  confirmation. Trigger it as a follow-up step after the add-shadcn-component or
  design-tokens skills run, even if the user doesn't name Storybook.
---

# Storybook Sync

Stories are documentation, and documentation rots silently: the code changes, the
tests still pass, the app still runs, and the story keeps confidently showing the
old truth. Nobody notices until someone opens Storybook to learn the system and
gets misled. Your job is to close that gap — find where a story no longer matches
the code it documents, and bring it back in line.

The canonical failure this skill exists for: the token system was refactored into
three tiers and new component-level knobs (`--button-bg`, `--badge-bg`, …) were
added, but `colors.stories.tsx` — whose entire purpose is to catalog the tokens —
wasn't touched, so it kept advertising the old set. Same story drift happens to a
component's variant list, its "CSS variables that affect this component" reference
table, and the prose at the top of a story file.

## When you run

Two ways in, same work:

- **Chained** — another skill (`add-shadcn-component`, `design-tokens`) just
  changed code. You're the cleanup pass that keeps the stories honest about that
  change. Scope yourself to what that skill touched.
- **Standalone** — someone asks whether the stories are current, or to audit for
  drift. If they point at specific files or a recent change, scope to that; if
  they want a full sweep, check everything.

## How to work

The shape is always: **figure out what could have drifted → establish the source
of truth → compare → report → fix on confirm.** Don't edit first and explain
later; the user asked to see the drift before it's fixed (a wrong "fix" to a story
is just more drift).

Keep two kinds of finding distinct, because they get handled differently:

- **Drift** — a story that *exists* and now contradicts the code (a stale token
  row, a removed variant still listed, a wrong docblock claim). This is the core
  job; fix it once the user confirms.
- **Coverage gap** — something that *doesn't exist yet* but arguably should: a
  component with no story at all, or a component with no token-reference table.
  This isn't drift — nothing is *wrong*, it's just *absent*. Report these as
  recommendations and create the new file only if the user says yes. Don't fold
  net-new stories into a "sync" silently; a surprise new file is its own kind of
  noise, and the user may have left it out on purpose.

### 1. Scope: what changed, and which stories does it touch?

Unless asked for a full audit, start from the diff — `git diff` (working tree) or
the branch diff, whichever matches the situation. Then map changed code to the
stories that document it:

| Changed code | Stories that may now be stale |
| --- | --- |
| `components/<x>.tsx` (a component) | `components/<x>.stories.tsx` — its variants, args, and any token-reference story |
| `styles/semantic.css`, `styles/components.css` (token tiers) | `colors.stories.tsx` (the catalog) **and** every per-component story whose "CSS variables that affect this component" table lists a touched token |
| `styles/*` icon/font/radius changes | the matching `Foundations/*` catalog story |
| a brand-new component with no story | a missing story (see §4) |

The token→story fan-out is the easy one to under-scope. A token rename doesn't
just hit the colors catalog — it hits the button's `CssVariables` table too. Grep
the stories for the old token name to find every reference.

### 2. Establish the source of truth per check, then compare

The four check kinds and what "the truth" is for each:

#### A. Foundations catalogs (`Foundations/*` stories: Colors, Icons, …)

These hand-curate a list that mirrors something authoritative in the code. They
drift when the authoritative thing grows or changes and the list doesn't.

- **Colors** (`colors.stories.tsx`) — the truth is the set of color tokens
  exposed as Tailwind utilities: the `--color-*` mappings inside `@theme inline`
  blocks across `semantic.css` **and** `components.css`. Enumerate those, then
  check the story's `GROUPS` array:
  - every exposed color token appears as a swatch (nothing missing),
  - no swatch references a token that no longer exists (nothing stale),
  - tier-3 component knobs (`--button-bg`, …) sit in the "Component tokens" group,
    not mixed in with semantic roles — the grouping teaches the tier model, so
    miscategorization is its own kind of drift.
  Internal tier-1 primitives (`primitives.css`) are deliberately *not* catalogued;
  don't add them.
- **Icons** (`icons.stories.tsx`) — the gallery itself iterates the live
  `lucide-react` export, so icon *coverage* can't drift. What can drift is the
  hand-written `iconAttributes` prop table and `svgDefaults` — verify they still
  match lucide's actual props/defaults.
- **Typography** (`typography.stories.tsx`) — the truth is two things: the
  family tokens (`--font-sans`, `--font-heading` in `semantic.css`) and the
  type-scale tokens Tailwind defines in `node_modules/tailwindcss/theme.css`
  (`--text-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`). Verify the
  story's size/weight/leading/tracking tables match those token values.

Prefer making a catalog data-driven (iterate the source) over hand-listing it when
you touch one — a list that derives itself can't go stale. But don't rewrite a
working hand-list into a parser just to prove the point; weigh it.

**Show canonical token values, not `getComputedStyle` output.** When a catalog
displays a token's *value*, render the value as the token defines it — `text-3xl`
→ `1.875rem`, `leading-snug` → `1.375`, `tracking-tight` → `-0.025em` — sourced
from a data array, not measured off a rendered sample. `getComputedStyle` resolves
everything to px against whatever font-size the sample uses, so a clean rem /
unitless / em scale renders as arbitrary px (`leading-tight` → `17.5px`) and a
*consistent* scale looks broken; it also returns `"normal"` for unset values,
easily mislabeled as `0`. Reserve live reads for values that are genuinely
themeable at runtime and where the *resolved* value is the point: colors (the
Colors story reads live `var()` values because semantic tokens change per theme)
and font-family (`--font-sans` is overridable). Everything else: canonical, from
data.

#### B. Per-component stories

The truth is the component `.tsx`. Two things to reconcile:

- **Variants & args** — the component's `cva` `variants` object is the contract.
  Every variant key and every option should be reachable in the story:
  `argTypes` options should list the same values, and a `Variants`/`Sizes` story
  should render them. A variant added to the component but missing from the story
  is undocumented; an option in the story that's gone from the component is stale.
- **Token-reference stories** — some components ship a story (often named
  `CssVariables`, an expandable "CSS variables that affect this component" table)
  listing the tokens that drive their look. The truth is what the component's
  classes actually reference: `bg-button` → `--button-bg`, `rounded-(--button-radius)`
  → `--button-radius`, etc. When the component is rewired to new tokens, this
  table is the single most overlooked place — reconcile each row against the
  current class list, fix the `affects:` descriptions too, and drop rows for
  tokens the component no longer uses.
  - If the component has *no* such table at all (e.g. Badge gained `--badge-*`
    knobs but never had a reference story), that's a **coverage gap, not drift** —
    see the rule below. Don't manufacture a new reference story as part of a sync;
    surface it as a suggestion and add it only if the user says yes.

#### C. Missing stories

Every component in `packages/ui/src/components/*.tsx` should have a sibling
`*.stories.tsx` (the Storybook glob only picks up `*.stories.@(ts|tsx)`). List the
`.tsx` files with no story sibling. In chained mode, focus on the component that
was just added — a new component with no story is the most common gap.

These are coverage gaps (per the rule above), so default to suggesting. The
exception: when the user's request *is* about coverage — "make sure the stories
cover the new Callout", "I just added X" — they've already asked you to fill the
gap, so creating the story is the work, not a surprise. Read the intent: a sync/
audit that happens to pass an uncovered component → suggest; an explicit "cover
this" → build it (matching the closest existing story's conventions).

#### D. Docblock prose

The JSDoc comment at the top of a story (and per-story `docs.description`) often
explains *how the system works* — e.g. the colors story's paragraph describing the
three tiers and which file each lives in. When the underlying structure changes,
these become confidently wrong. Check the factual claims (file names, token names,
counts, tier descriptions) against the code, not the writing quality.

### 3. Report before fixing

Produce a short, scannable report grouped by story file. For each finding give the
file:line, what's wrong, and the corrected value — concrete enough that the user
can approve at a glance:

```
### colors.stories.tsx
- MISSING: --button-fg, --button-bg-hover exposed in components.css but not in the
  "Component tokens" group (colors.stories.tsx:71)
- STALE: swatch for --accent-muted — token no longer exists in semantic.css

### button.stories.tsx
- STALE: CssVariables table lists --primary as "Default variant background", but
  button.tsx:11 now uses bg-button (--button-bg). Rows for --button-bg/-fg/-hover
  and --button-radius are missing. (button.stories.tsx:182)

### card.tsx
- MISSING STORY: no card-token reference; card.tsx gained --card-radius
```

If nothing drifted, say so plainly — "stories are in sync with the change" is a
valid and useful result. Don't invent findings to look busy.

### 4. Fix on confirmation

Once the user okays it, apply the edits. This is surgical work: match the existing
file's conventions exactly — the `GROUPS`/`Token` shape in the colors story, the
`colorTokens`/`affects` row shape in a `CssVariables` story, the docblock voice.
Touch only the rows/lines that drifted; don't reformat or "improve" the
surrounding story. After editing, re-read your changes against the source of truth
once more to be sure the fix is itself correct.

## Notes

- The dev preview app (`apps/web`) is a separate showcase from Storybook. This
  skill is about the `*.stories.tsx` files under `packages/ui`, not `App.tsx`.
- Color *values* and WCAG contrast belong to the `color-tokens` skill; where the
  colors story computes a contrast ratio, you're only checking the token is
  *listed*, not re-deriving the value.
