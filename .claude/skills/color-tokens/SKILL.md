---
name: color-tokens
description: >-
  Create, edit, or choose CSS color variables (design tokens) in the Atomic
  Reactor design system, with WCAG 2.x AA contrast verification built in. Use
  this whenever color is involved at the token level — adding a new color token,
  changing an oklch value, picking which existing token a component should use,
  converting a hex/rgb/hsl color into the system, theming light vs dark, or
  reviewing colors for accessibility. Trigger it even when the user doesn't say
  "WCAG" or "token" — e.g. "make the muted text a bit darker", "what color
  should this badge be", "add a brand-blue", "this button is hard to read",
  "turn #1d9bf0 into one of our colors", or "is our palette accessible". This
  repo serves schools that require AA compliance, so any color change must be
  contrast-checked before it ships. Do not eyeball oklch contrast — always run
  the bundled checker.
---

# Color tokens (Atomic Reactor) + WCAG AA

All colors in this design system live as CSS custom properties in
`packages/ui/src/styles/globals.css`, authored in **oklch**, with a `:root`
(light) block and a `.dark` block. Components never hardcode colors — they
reference tokens through Tailwind utilities (`bg-primary`,
`text-muted-foreground`, `border-border`, …).

Two things make color work here non-trivial, and they're why this skill exists:

1. **Schools require WCAG 2.x AA.** A color change isn't done until its contrast
   is verified, in *both* themes. oklch lightness is not a contrast ratio —
   you cannot eyeball it. Use the bundled checker.
2. **The brand palette carries the identity.** The amber/gold primary and
   teal/cyan chart ramp are the Atomic Reactor brand (see CLAUDE.md). Don't *quietly*
   change one to "fix" a contrast problem — prefer adjusting the other side of the
   pair; if a brand token itself should change, confirm it's intended first.

## The checker (use it for every color decision)

`scripts/check_contrast.py` converts oklch/hex/rgb/hsl to sRGB luminance and
reports exact WCAG ratios. It handles alpha tokens (e.g. dark-mode
`oklch(1 0 0 / 10%)`) by compositing over the background first.

```bash
# Audit every token pair, light + dark (run this after ANY token edit):
python3 .claude/skills/color-tokens/scripts/check_contrast.py audit \
  packages/ui/src/styles/globals.css

# Check a specific candidate pair before committing to it:
python3 .claude/skills/color-tokens/scripts/check_contrast.py pair \
  "oklch(0.852 0.199 91.936)" "oklch(0.421 0.095 57.708)" --kind text

# Convert an incoming color into the oklch this repo uses:
python3 .claude/skills/color-tokens/scripts/check_contrast.py to-oklch "#1d9bf0"
```

`--kind` is `text` (4.5:1), `large` (3.0:1), or `nontext` (3.0:1). The `pair`
and `audit` commands exit non-zero on any failure, so they double as a check.

## WCAG AA thresholds (same across 2.0 / 2.1 / 2.2)

| What | Success criterion | Ratio |
|------|-------------------|-------|
| Normal text & icons conveying text | 1.4.3 Contrast (Minimum) | **4.5:1** |
| Large text (≥24px, or ≥18.66px bold) | 1.4.3 | **3.0:1** |
| UI component boundaries & states, focus rings, meaningful graphics | 1.4.11 Non-text Contrast | **3.0:1** |
| Information not conveyed by color alone | 1.4.1 Use of Color | (see below) |

There is no published "WCAG 2.3" — versions are 2.0, 2.1, 2.2. For *color* the
rules above are identical in all of them, so whichever version a school cites,
these are the numbers.

### Interpreting the results (don't cry wolf)

The audit flags every pair mechanically; apply judgment to what it reports:

- **Decorative vs functional borders.** 1.4.11 applies to a border only when it
  is the *sole* way to perceive a control or its state — e.g. an input's
  outline, an unfilled button, a selected/focused state. A low-contrast divider
  between two cards, or a subtle border behind text that already meets contrast,
  is decorative and exempt. So `border / background` failing is usually fine;
  `input / background` failing is a real problem, because the input's edge is
  how a user finds the field.
- **Focus rings (`ring`) must clear 3:1** against whatever they sit on — this is
  often where keyboard accessibility quietly breaks.
- **"Passes only at large-text 3:1"** means the pair is legal *only* if that
  token is used exclusively for large/bold text. If it's body copy, it fails.
  `muted-foreground` is the usual offender — confirm how it's actually used
  before declaring it compliant.
- **Status colors (`destructive`/`success`/`warning`/`info`) are audited two
  ways** — as colored text over the background (`text-success`), and as a solid
  fill with white text (`bg-destructive text-white`). Both are flagged
  conditional, because which one is real depends on usage: check the component.
  In this system the status colors are typically used as `text-{status}` on a
  faint `bg-{status}/10` tint, so the "as text" row is usually the governing
  one. Several fail in light mode as text and most fail as white-on-fill in both
  themes — fix by darkening the token (they're not brand tokens) or pairing fills with
  a dark foreground; reserve the light values for large text only.
- **Chart colors are audited against the background** (1.4.11, 3:1) because a
  series has to be distinguishable from the canvas. The ramp is **tuned per
  theme** so each series stays visible on its background (light uses the darker
  teals, dark uses the lighter ones) — that visibility is the constraint to
  preserve. If a series still falls below 3:1 against its background, the **teal
  chart ramp is a brand default**, so don't silently re-tune it: flag the gap and
  confirm the fix (adjust that theme's value, or use pattern/label encoding
  rather than color alone). Note the audit checks series-vs-background, not series-vs-series
  adjacency — neighbouring slices/lines also need to differ, which is a design
  check, not a token ratio.
- **1.4.1 (color alone)** can't be measured by ratio. When tokens encode state —
  `destructive`, `success`, `warning`, `info` — flag that the UI must also carry
  a non-color signal (icon, text, underline). You can't satisfy this by picking
  a better color.

## When you're CREATING or EDITING a token value

1. **Author in oklch.** If the user hands you hex/rgb/hsl, convert it with
   `to-oklch` and use that. Keep the same `L C H` precision as neighboring tokens.
2. **Set it in both `:root` and `.dark`.** A value that passes in light can fail
   in dark and vice-versa (the audit above proved this for `border` and `ring`).
   Dark mode usually needs a *lighter* foreground / *more separated* surface.
3. **If the token is new, wire it into `@theme inline`** at the top of
   `globals.css` as `--color-<name>: var(--<name>);` — Tailwind v4 won't generate
   `bg-<name>` / `text-<name>` utilities otherwise. Mirror the existing entries.
4. **Run the audit.** Fix anything that regresses before calling it done.

## When you're CHOOSING which token a component should use

Mirror the closest existing component (see `add-shadcn-component` skill) — the
pairing is almost always a base + its `-foreground` (e.g. `bg-secondary` with
`text-secondary-foreground`), which the system already keeps accessible. If you
reach for a foreground/background combo that *isn't* an existing pair, check it
with `pair` first. Status colors (`destructive`/`success`/`warning`/`info`) have
no `-foreground` partner; when used as solid fills they're typically paired with
a near-white text — verify that specific combination.

## Failure protocol — report and confirm (don't silently edit a brand token)

When a pair fails, stop and report: the pair, the **measured ratio**, the
**target**, and a concrete fix. Then let the user choose. Don't auto-apply.
**Prefer resolving a failure by adjusting the *other* side of the pair** rather
than the brand token (amber primary, teal charts); if the brand token itself is
the right thing to change, confirm that's intended before doing it.

How to propose a fix in oklch: contrast is driven almost entirely by **L**
(lightness); chroma and hue barely move it. So nudge L on the non-brand color
and re-check with `pair` until it clears, keeping C and H so the hue stays on-brand.

> **`muted-foreground / muted` is 4.34:1 in light mode — fails AA for body text
> (needs 4.5:1).** `muted` is a brand-default neutral surface, so darken the text:
> try `--muted-foreground: oklch(0.53 0 0)` → re-run `pair` → 4.84:1, PASS. If
> `muted-foreground` is only ever used on large/bold text, it already clears the
> 3:1 large-text bar and no change is needed — confirm usage first.

Keep proposals minimal: the smallest L change that clears the threshold, nothing
speculative, and only the pair that failed.
