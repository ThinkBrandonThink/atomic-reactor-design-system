# Token types — tier placement & Tailwind v4 exposure

For each token type: where it lives in the three tiers, the exact mechanism that
makes Tailwind v4 generate (or not need) a utility, and whether it's safe for a
consumer theme to override. Types not yet in the repo (shadow, z-index, motion,
breakpoints) are included — the pattern is the same; follow it when you add the
first one.

The recurring distinction: **colors must be mapped into `@theme inline` as
`--color-*`** to get `bg-/text-/border-` utilities. **Everything else** is
either (a) a Tailwind theme namespace that already generates utilities
(`--text-*`, `--shadow-*`, …) or (b) a bare custom property consumed in a
component class via the arbitrary-property syntax `prop-(--token)`.

## Table of contents
1. [Color](#1-color)
2. [Radius](#2-radius)
3. [Spacing](#3-spacing)
4. [Typography — font family](#4-typography--font-family)
5. [Typography — size, weight, line-height, tracking](#5-typography--size-weight-line-height-tracking)
6. [Shadow / elevation](#6-shadow--elevation)
7. [Z-index / layering](#7-z-index--layering)
8. [Motion — easing, duration, animation](#8-motion--easing-duration-animation)
9. [Breakpoints & containers](#9-breakpoints--containers)
10. [Opacity & misc scalar knobs](#10-opacity--misc-scalar-knobs)

---

## 1. Color
- **Primitive:** named raw `oklch(...)` in `primitives.css` (e.g. `--gold-300`).
  Not in `@theme` — deliberately, so no `bg-gold-300` utility leaks the palette.
- **Semantic:** role token in `semantic.css` `:root` + `.dark`
  (`--primary: var(--gold-300)`), **mapped** in its `@theme inline`:
  `--color-primary: var(--primary);` → `bg-primary`, `text-primary`, etc.
- **Component:** knob in `components.css` defaulting to a role
  (`--button-bg: var(--primary)`), mapped there:
  `--color-button: var(--button-bg);` → `bg-button`. Utility name = the
  `--color-*` key, not the source var.
- **Consumer-themeable?** Yes — semantic roles and component color knobs.
- **Value/contrast:** the **color-tokens** skill owns the oklch value and WCAG.

## 2. Radius
- **Semantic:** the *scale* lives in `semantic.css` `@theme inline` as multiples
  of the base `--radius`: `--radius-sm: calc(var(--radius) * 0.6)` …
  `--radius-4xl: calc(var(--radius) * 2.6)`. `rounded-md`/`rounded-xl` resolve
  through it; changing `--radius` rescales the whole system.
- **Component:** per-component knob in `components.css`
  (`--card-radius: var(--radius-xl)`). **Not** mapped to `--color-*`. Consumed in
  the class via `rounded-(--card-radius)` (and `rounded-t-(--card-radius)` etc.).
- **Consumer-themeable?** Yes — `--radius` (global feel) and the component radius
  knobs. `--radius: 0` gives square corners; `--button-radius: 9999px` gives
  pills.

## 3. Spacing
- **Base:** Tailwind v4 provides `--spacing` (the `0.25rem` step). `p-4`, `gap-2`
  derive from it; `--spacing(4)` is the function form used inside arbitrary
  values.
- **Component:** a padding/gap knob is a bare custom property, defaulted with the
  function — e.g. `--card-spacing: --spacing(4)` (in this repo it's set inline on
  the card class: `[--card-spacing:--spacing(4)]`). Consumed via `p-(--card-spacing)`,
  `gap-(--card-spacing)`, `py-(--card-spacing)`. Not mapped to `--color-*`.
- **Scale extension:** to add named spacing steps, add `--spacing-<name>` in an
  `@theme` block → generates `p-<name>` etc. Rarely needed; prefer the base scale.
- **Consumer-themeable?** Component spacing knobs, yes, if you expose them like
  the radius knobs.

## 4. Typography — font family
- **Semantic/theme:** `--font-sans` is a plain `@theme` token (NOT `@theme
  inline`) on purpose — its value is a literal string, and the non-inline form
  emits `--font-sans` to `:root` so a `.theme-*` class can override it at
  runtime and have body text follow. `--font-heading` aliases it via `@theme
  inline` (because its value is a `var()`, which the inline form forwards). See
  the long comment in `semantic.css` before changing this.
- **Exposure:** `font-sans` / `font-heading` utilities come from the `--font-*`
  namespace automatically.
- **Consumer-themeable?** Yes — `--font-sans`, `--font-heading`. Warn that a font
  only renders if the site actually loads it; keep a fallback after the comma.

## 5. Typography — size, weight, line-height, tracking
- **Theme namespaces (Tailwind built-in):** `--text-*` (sizes), `--font-weight-*`,
  `--leading-*`, `--tracking-*`. These already generate `text-sm`, `font-medium`,
  `leading-tight`, `tracking-wide`, and are already overridable.
- **Where to set overrides:** to change the system defaults, set them in an
  `@theme` block; to change per-theme, in the `.theme-*` class (the friendly
  template exposes `--text-xs … --text-4xl`).
- **Consumer-themeable?** Yes — the `--text-*` steps especially (scale the whole
  type ramp up/down).

## 6. Shadow / elevation
*(Not in the repo yet — follow this when adding the first.)*
- **Semantic:** define an elevation role in `semantic.css` if it's reused
  (`--shadow-1`), or use Tailwind's `--shadow-*` namespace in `@theme` to get
  `shadow-<name>` utilities directly.
- **Component:** a component knob (`--card-shadow`) in `components.css`,
  defaulted to the semantic elevation, consumed via `shadow-(--card-shadow)`.
  Not a `--color-*` mapping.
- **Dark mode:** shadows usually need different values (or alpha) under `.dark` —
  set both, like colors.
- **Consumer-themeable?** Component shadow knobs, yes.

## 7. Z-index / layering
*(Not in the repo yet.)*
- **Semantic:** a small named scale in `semantic.css` is the right home
  (`--z-dropdown`, `--z-overlay`, `--z-toast`) so stacking is coordinated, not
  ad-hoc per component.
- **Exposure:** consumed via `z-(--z-overlay)` arbitrary syntax, or add
  `--z-<name>` under a custom namespace if you want `z-<name>` utilities. No
  `--color-*` mapping.
- **Consumer-themeable?** Almost never — layering is structural, not brand.
  Keep it internal (semantic), don't expose in the consumer template.

## 8. Motion — easing, duration, animation
*(Tailwind provides defaults; extend only if needed.)*
- **Theme namespaces:** `--ease-*` (easing curves), `--animate-*` (named
  keyframe animations). Adding them in `@theme` generates `ease-<name>` /
  `animate-<name>` utilities. Durations use Tailwind's `duration-*` scale or an
  arbitrary `duration-(--token)`.
- **Component:** a transition knob is a bare property consumed in the class. This
  repo's interactive components use `transition-all` + the press effect rather
  than per-component duration tokens — match that unless there's a real need.
- **Consumer-themeable?** Rarely; motion is a system concern. Respect
  `prefers-reduced-motion` regardless of tokens.

## 9. Breakpoints & containers
*(Tailwind built-in; override sparingly.)*
- **Theme namespaces:** `--breakpoint-*` (responsive `sm:`/`md:`/…) and
  `--container-*` (container-query sizes for `@container`). Override in `@theme`
  only to change the system's responsive structure.
- **Consumer-themeable?** No — these are layout structure, not brand. Keep out of
  the consumer template.

## 10. Opacity & misc scalar knobs
- **Component:** one-off scalars (a disabled opacity, a ring width) are usually
  best left as literals in the component class unless a consumer genuinely needs
  to tune them. If they do, expose a component knob and consume it via arbitrary
  syntax (`opacity-(--token)`). Don't manufacture tokens for values nobody will
  theme — a token that's never overridden is just indirection.
