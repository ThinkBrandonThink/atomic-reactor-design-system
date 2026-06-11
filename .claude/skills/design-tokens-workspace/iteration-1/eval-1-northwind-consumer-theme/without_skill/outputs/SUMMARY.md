# Northwind theme — summary

## File created

- `styles/themes/northwind.css` — a single consumer theme file defining a
  `.theme-northwind` class. No existing files were modified. This matches the
  consumer-theme pattern shown in `styles/themes/_template.css`: a theme is a
  standalone `.theme-*` override file applied/uploaded separately and not
  imported into `globals.css`. Apply by adding `theme-northwind` to a wrapping
  element (e.g. `<html class="theme-northwind">`).

## Tokens set and why

The system is a three-tier token architecture (raw primitives → semantic roles
→ component knobs). Consumer themes override the semantic tier (tier 2) and the
per-component knobs (tier 3, the public theming API). Everything left unset
keeps the standard Atomic Reactor look.

| Token | Value | Why |
|-------|-------|-----|
| `--primary` | `#1e40af` | Northwind's deep blue brand. `--button-bg` and `--badge-bg` default to `--primary`, so this flows the brand into buttons, links, and highlights. |
| `--primary-foreground` | `#ffffff` | Readable text/icon color on top of the deep blue. |
| `--button-radius` | `9999px` | Fully-rounded pill buttons (consumed via `rounded-(--button-radius)`). |
| `--card-radius` | `0` | Square-cornered cards (consumed via `rounded-(--card-radius)`). |

Button radius and card radius are independent tier-3 knobs, so the shapes
diverge (pill vs square) without affecting inputs, badges, or anything else.

## Verification

- WCAG contrast: white (#ffffff) on brand blue (#1e40af) = 8.72:1 — passes
  WCAG 2.x AA (>=4.5:1) and AAA (>=7:1) for normal text. Relevant because this
  repo serves schools requiring AA compliance.
- Token wiring confirmed in source:
  - components/button.tsx uses `rounded-(--button-radius)` and `bg-button`
    (`--button-bg` defaults to `--primary`).
  - components/card.tsx uses `rounded-(--card-radius)` (and rounded-t/-b
    variants).
  - styles/components.css confirms `--button-radius`, `--card-radius`,
    `--badge-bg`, and `--button-bg` default to the overridden semantic tokens.
- Hover tint: `--button-bg-hover` is
  `color-mix(in oklab, var(--button-bg) 80%, transparent)` — resolves correctly
  against the new blue; no extra override needed.
