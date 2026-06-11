# Card drop shadow — change summary

Added a subtle, tunable drop shadow to cards using the three-tier token
architecture, with separate light/dark values. Shadow is a token type not
previously present in the repo; introduced following the skill's
references/token-types.md §6 (Shadow / elevation).

## What changed and which tier

### Tier 2 — semantic (styles/semantic.css)
Added an elevation role `--shadow-elevation-card` in BOTH `:root` and `.dark`.
A semantic role (not a one-off inline value) because the shadow is a reusable
elevation concept and the task wants something "we can tune later" — one place,
light and dark together.
- Light: `0 1px 2px 0 oklch(0 0 0 / 0.08), 0 1px 3px 0 oklch(0 0 0 / 0.05)` — soft, low-alpha, subtle.
- Dark:  `0 1px 2px 0 oklch(0 0 0 / 0.4), 0 1px 3px 0 oklch(0 0 0 / 0.3)` — same geometry, higher black alpha so it still reads on the already-dark card surface.

### Tier 3 — component (styles/components.css)
Added knob `--card-shadow: var(--shadow-elevation-card);` — defaults to the
semantic role (never a raw primitive), identical behavior until overridden.
Follows the `--{component}-{knob}` naming contract.

### Component (components/card.tsx)
Consumed the knob on the Card root via Tailwind v4 arbitrary syntax: added
`shadow-(--card-shadow)` to the existing class list (alongside the existing
`ring-1 ring-foreground/10`). No other slots changed.

## Why no @theme inline / --color-* mapping
Shadows are not colors: like radius and spacing they are consumed via the
`shadow-(--token)` arbitrary-property syntax, not a generated bg-/text-/border-
utility. So neither token is mapped into @theme inline. (token-types.md §6.)

## How it's tunable later
- System-wide elevation: edit `--shadow-elevation-card` in semantic.css (:root and/or .dark) — every card updates at once.
- Just cards: edit `--card-shadow` in components.css.
- Per consumer/brand, no code: `--card-shadow` is a public tier-3 knob, so a `.theme-*` file may override it at runtime (the checker's allowed-token regex already permits `--shadow-*`). e.g. `.theme-acme { --card-shadow: 0 4px 12px rgb(0 0 0 / 0.15); }`

## How dark mode is handled
The semantic role is defined in both :root and .dark with different alpha
(0.08/0.05 -> 0.4/0.3). Because `--card-shadow` resolves to
`--shadow-elevation-card`, toggling `.dark` on <html> automatically swaps in the
darker shadow with no component change.

## Locked brand
Untouched. No primitives, brand colors, radius scale, or fonts modified.

## Verification
Command:
    python3 .claude/skills/design-tokens/scripts/check_tokens.py \
      .../with_skill/sandbox/styles
Result: OK — 0 errors, 2 warning(s).

The 2 warnings are expected false positives, not breakage. The checker's
is_color heuristic sees oklch(...) inside the box-shadow value and assumes the
token wants a --color-* mapping. It does not: shadows use shadow-(--token) (the
same exemption the checker names for radius/spacing). Adding --color-card-shadow
mappings would be wrong — it would try to generate bg-/text- utilities from a
multi-part box-shadow string. Warnings are non-failing by design; eyeballed and
correct to leave.
