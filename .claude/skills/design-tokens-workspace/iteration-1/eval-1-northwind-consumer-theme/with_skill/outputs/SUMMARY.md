# Northwind theme — summary

## File created
- `styles/themes/northwind.css` — a single consumer theme file (a `.theme-northwind`
  class), built by copying `themes/_template.css` and renaming the selector. It is
  the public-API tier (consumer overrides), so it only touches semantic roles and
  component knobs — no primitives.

No other files were created or modified. The brand color, pill buttons, and square
cards are all expressible through tokens that already exist in the public theming API.

## Tokens set and why
| Token | Value | Why |
|-------|-------|-----|
| `--primary` | `#1e40af` | Northwind's deep-blue brand. Semantic role — flows into buttons, links, highlights. |
| `--primary-foreground` | `#ffffff` | Text/icon color on the brand. White gives strong contrast on the deep blue. |
| `--button-radius` | `9999px` | Fully-rounded pill buttons (component knob; affects only buttons). |
| `--card-radius` | `0` | Square-cornered cards (component knob; affects only cards). |

`--button-radius` and `--card-radius` are independent component knobs defaulting to
the semantic radius scale, so overriding them changes only buttons and only cards —
inputs, badges, etc. keep standard rounding.

## Contrast check (color-tokens checker)
- `#1e40af` → `oklch(0.424 0.181 265.638)`.
- White text on the deep-blue button surface: **8.72:1 — PASS** (needs 4.5:1). This is
  the brand's main use and passes in both light and dark mode (button surface is the
  brand, foreground white regardless of theme).

### Flagged finding (dark mode)
- `#1e40af` as link/primary-colored text or a tinted UI surface against the dark-mode
  page background (`oklch(0.145 0 0)`): **2.27:1 — FAIL** (needs 4.5:1 text / 3:1 nontext).
- The deep blue reads fine on a white page but disappears on the dark page background.
  Per the skill I did NOT silently change the brand. The theme is safe for its main use
  (white-on-blue buttons, blue accents on light pages). If Northwind enables dark mode
  and uses the brand as link text or a tinted surface, that pairing needs a lighter
  brand tint for dark mode (e.g. a system-side `.dark .theme-northwind` override) — the
  friendly single-class consumer template can't express a separate dark value. Flagged
  for the user's decision.

## Verification commands and results
Token structure / wiring (design-tokens checker):
```
check_tokens.py <sandbox>/styles
  -> OK — 0 errors, 0 warnings  (exit 0)
check_tokens.py <sandbox>/styles --theme <sandbox>/styles/themes/northwind.css
  -> OK — 0 errors, 0 warnings  (exit 0)   # theme touches only public tokens
```
Contrast (color-tokens checker):
```
to-oklch "#1e40af"                                          -> oklch(0.424 0.181 265.638)
pair "#1e40af" "#ffffff" --kind text                        -> 8.72:1  PASS  (button: white on blue)
pair "#1e40af" "oklch(0.145 0 0)" --kind text               -> 2.27:1  FAIL  (brand on dark bg)
pair "#1e40af" "oklch(0.145 0 0)" --kind nontext            -> 2.27:1  FAIL  (brand surface on dark bg)
```
