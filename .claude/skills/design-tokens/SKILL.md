---
name: design-tokens
description: >-
  Manage the CSS design-token architecture and theming of the Atomic Reactor
  design system — the three-tier system (raw primitives → semantic roles →
  component knobs) in packages/ui/src/styles, deciding which tier a token
  belongs in, naming it, wiring it into Tailwind v4's @theme so utilities
  generate, keeping the tiers consistent, and creating or validating consumer
  .theme-* override files. Use this whenever a token of ANY type is added,
  moved, renamed, or themed — color, radius, spacing, font/typography, shadow,
  z-index, motion — or when someone asks "where should this token live", wants a
  single component restyled without touching the rest, wants a theme built for a
  client/brand, or needs the token files kept in sync. Trigger it even when the
  user never says "token", "tier", or "theme" — e.g. "add a --shadow-card",
  "make the button corners themeable but leave inputs alone", "build a theme for
  Acme with a blue brand and pill buttons", "wire this spacing value into
  Tailwind", "our card padding should be configurable", "is the token structure
  consistent". For picking a specific color's oklch VALUE or checking WCAG
  contrast, that is the color-tokens skill's job — this skill owns structure,
  placement, wiring, and theming, and hands color values + contrast to it.
---

# Design tokens & theming (Atomic Reactor)

Every visual constant in this system is a CSS custom property, organized into
**three tiers** that each live in their own file and import in order from
`globals.css`:

```
primitives.css   tier 1 — raw palette / raw values        (INTERNAL)
semantic.css     tier 2 — roles + brand intent + light/dark (the system)
components.css   tier 3 — per-component knobs               (PUBLIC theming API)
themes/*.css     consumer overrides (.theme-*)              (what clients ship)
```

This split is canonical — treat the four files and their import order in
`globals.css` as ground truth. The
whole point is that a change at one tier has a predictable blast radius: edit a
primitive and the value changes everywhere it's used; edit a semantic role and
one *meaning* shifts system-wide; edit a component knob and exactly one
component changes. That predictability only holds if one rule holds.

## The one rule

**A tier may only reference the tier(s) above it. Nothing reaches downward or
past.**

- `primitives` reference nothing (raw `oklch(...)`, `4px`, etc.).
- `semantic` references **primitives** (and other semantic tokens). Never a
  component knob.
- `components` default to a **semantic** role (`var(--primary)`,
  `var(--radius-lg)`). **Never a raw primitive** — if a button defaulted to
  `var(--gold-300)` it would silently desync from the brand the day `--primary`
  is repointed.
- `themes/*.css` override **semantic roles or component knobs only** — the
  public API. A consumer theme that sets `--gold-300` is reaching into internals
  that can be renamed without warning.

`scripts/check_tokens.py` enforces exactly this (see **Verify** below). When in
doubt about a placement, the rule above is the tiebreaker.

## Which tier does a new token go in?

Ask, in order:

1. **Is it a raw value reused by more than one role?** (a specific gray, a hue,
   a base unit) → **primitive**. Give it a deduplicated name and let semantic
   tokens point at it. If it's a one-off raw value used by a single role, it's
   fine to inline it in the semantic token instead of inventing a primitive.
2. **Is it a system-wide *role* or *intent*?** (`--background`, `--border`,
   `--destructive`, the radius scale) → **semantic**. This is where light vs
   dark diverge — define it in **both** `:root` and `.dark`.
3. **Is it a knob you want to restyle for ONE component without touching the
   rest?** (`--button-radius`, `--card-spacing`) → **component**. Default it to
   the semantic token it shadows, so behavior is identical until someone
   overrides it.

Most "add a token" requests are tier 2 (a new role) or tier 3 (a new knob).
Adding a primitive is only warranted when a raw value is genuinely shared.

## Wiring a token so Tailwind actually sees it

This is the step that silently breaks if skipped, because Tailwind v4 + Vite
emit nothing visible when a token isn't wired — there's no error. **How a token
is exposed depends on its type:**

- **Colors** must be mapped in an `@theme inline` block as
  `--color-<name>: var(--<name>);` — that mapping is what makes
  `bg-<name>` / `text-<name>` / `border-<name>` utilities exist. Semantic colors
  are mapped in `semantic.css`; component color knobs in `components.css`. The
  utility name comes from the `--color-*` key, so `--color-button: var(--button-bg)`
  yields `bg-button`, not `bg-button-bg`.
- **Radius, spacing, and other layout knobs are NOT mapped to `--color-*`.**
  They're consumed directly in component classes via Tailwind v4's
  arbitrary-property syntax — `rounded-(--button-radius)`, `p-(--card-spacing)`,
  `shadow-(--card-shadow)`. No `@theme` entry needed.
- **The radius SCALE** (`--radius-sm`…`--radius-4xl`) lives in `@theme inline`
  as multiples of `--radius`, so `rounded-md` etc. resolve through it.
- **Fonts, text sizes, weights, line-heights** ride Tailwind's own `--font-*`,
  `--text-*`, `--font-weight-*`, `--leading-*` theme keys — already overridable.
  Note `--font-sans` is a plain `@theme` (not `inline`) token on purpose so a
  consumer theme can repoint it at runtime; see the comment in `semantic.css`.

For any token type — including ones not in the system yet (shadow, z-index,
motion, breakpoints) — **read `references/token-types.md`**. It gives the tier
placement, the exact Tailwind v4 exposure mechanism, and whether the type is
consumer-themeable, for every type.

## Adding a token — the workflow

1. Decide the tier (decision list above).
2. Add the definition in the right file. For semantic, set it in **both** `:root`
   and `.dark`. For a component knob, default it to the semantic role it shadows.
3. Wire it for its type (colors → `--color-*` mapping; layout → consumed via
   arbitrary syntax). Mirror the nearest existing token of the same type.
4. If it's a **color** value decision (what oklch, does it pass contrast), that's
   the **color-tokens** skill — use it for the value and the WCAG check.
5. Run `scripts/check_tokens.py` and fix anything it flags.

### Making a component independently themeable (the tier-3 pattern)

When two components share a semantic role they can't diverge — e.g. button and
badge both defaulting to `--primary` can't be styled apart. Give the component
its own knobs that default to the role:

```css
/* components.css */
:root {
  --button-bg: var(--primary);
  --button-fg: var(--primary-foreground);
  --button-bg-hover: color-mix(in oklab, var(--button-bg) 80%, transparent);
  --button-radius: var(--radius-lg);
}
@theme inline {                /* only the COLOR knobs need this */
  --color-button: var(--button-bg);
  --color-button-fg: var(--button-fg);
  --color-button-hover: var(--button-bg-hover);
}
```

Then the component class uses `bg-button text-button-fg hover:bg-button-hover`
and `rounded-(--button-radius)`. Now a theme can repoint `--button-radius`
without affecting inputs or cards. Name knobs `--{component}-{knob}[-{state}]`,
lowercase-kebab — these names are a published stability contract (the checker
enforces the shape), so add freely but rename only on a major version.

## Creating a consumer theme

Consumer themes are the friendly, hand-editable override files clients ship
("upload in admin settings"). To build one — e.g. *"a theme for Acme: blue
brand, pill buttons"*:

1. Copy `themes/_template.css` to `themes/<name>.css` and rename the selector to
   `.theme-<name>`. Keep its style: **hex values are fine** (consumers use color
   pickers, not oklch), each override commented, everything optional.
2. Set only the public tokens the request needs — start with `--primary` /
   `--primary-foreground`, then component knobs (`--button-radius: 9999px` for
   pills). Never touch a primitive.
3. **Hand the brand/foreground pairs to the color-tokens skill** to confirm WCAG
   AA in both light and dark — a client's blue on white may fail. Flag failures;
   don't silently pick a different brand color.
4. Validate the file: `scripts/check_tokens.py <styles> --theme themes/<name>.css`.

To validate a theme someone *else* wrote (an uploaded file), skip to step 4 —
the `--theme` mode flags any primitive overrides, internal-mapping overrides, or
typos that would no-op.

## The brand defaults — confirm before changing

The amber/gold primary, Inter, and the radius scale are the Atomic Reactor
identity (see CLAUDE.md). (The chart palette is a functional multi-hue set, NOT a
brand color — retune it freely for accessibility.) They live in `semantic.css`,
partly to keep tools that regenerate `globals.css` from silently overwriting
them. They're changeable — but prefer not to repoint a brand token to satisfy a
contrast or styling request: reach first for adjusting the *other* side of the
pair or a theme-level override. If the brand token itself is the right thing to
change, confirm it's intended with the user before doing it.

## Verify

There is no build step that catches a broken token — `tsc` and `eslint` never
look at CSS, and Tailwind emits invalid values silently. The checker is the gate:

```bash
# Full audit — run after ANY token edit:
python3 .claude/skills/design-tokens/scripts/check_tokens.py packages/ui/src/styles

# Validate one consumer theme file:
python3 .claude/skills/design-tokens/scripts/check_tokens.py packages/ui/src/styles \
  --theme packages/ui/src/styles/themes/acme.css
```

It checks tier-reference integrity, undefined `var()` references, that every
color token is wired into a `--color-*` utility, the tier-3 naming contract, and
that consumer themes only touch public tokens. It exits non-zero on errors, so
it works as a pre-commit/CI gate too. After it passes, render the affected
components (the showcase / `npm run storybook`) and confirm the change looks
right in **both** light and dark — the checker proves wiring, not aesthetics.

## What "done" looks like

- New token is in the correct tier; component knobs default to a semantic role,
  never a raw primitive; light and dark both set for semantic tokens.
- Color tokens are wired into `@theme inline`; layout tokens consumed via the
  `(--token)` arbitrary syntax. No type left unexposed.
- Color *values* and contrast were taken to the color-tokens skill.
- Brand defaults untouched, or any change to one flagged to the user first.
- `check_tokens.py` is clean; the component looks right in both themes.

After the token change lands, hand off to the **`storybook-sync` skill**: the colors
catalog story (`colors.stories.tsx`) and any per-component "CSS variables" reference
story document these tokens, and they drift silently when tokens move or get added.
