---
name: theme-template-sync
description: >-
  Keep the consumer theme template (packages/ui/src/styles/themes/_template.css)
  in sync with the design tokens it exposes. The template is the friendly,
  hand-editable file clients fill in to restyle the app ("upload in admin
  settings"), and it drifts silently the moment a consumer-overridable token is
  added, removed, renamed, or its default changes in semantic.css /
  components.css — a new --button-bg knob never appears for clients, a removed
  token lingers as a dead override, a renamed token quietly no-ops. Use this
  whenever the token files changed and the template might be stale, or when
  someone asks "is the theme template up to date?", "did I expose that new knob
  to themers?", "the template still lists a token we deleted", "regenerate
  _template.css", or "what can a consumer actually override?". Run it as the
  FOLLOW-UP after the design-tokens skill adds/moves/renames a token, even if
  the user doesn't mention the template — adding a public knob isn't finished
  until consumers can see it. This skill owns _template.css generation and the
  @theme-template marker convention in the source files; it hands color VALUES
  and contrast to color-tokens and token tier/placement/wiring to design-tokens.
---

# Theme template sync (Atomic Reactor)

`themes/_template.css` is the **public theming surface** — the commented,
hex-friendly, every-line-optional file a non-technical client fills in to
restyle the app without touching code. It must list **exactly** the tokens a
consumer is allowed to override, with a plain-English label and an example
value for each.

The problem this skill solves: that template is downstream of the real tokens in
`semantic.css` and `components.css`, and nothing keeps it honest. Add a
`--button-bg` knob and forget the template → clients can't theme buttons. Delete
a token → the template advertises an override that now silently no-ops. Rename
one → same. The template drifts and no build step catches it (it's just CSS
comments).

The fix is to make the template a **derived artifact**. Every token in it comes
from an `@theme-template` *marker* sitting next to that token's definition in the
source. A generator script reads the markers and emits the template, so it can
never list a token the source doesn't expose, and can never miss one the source
does.

## The marker convention

A marker is a CSS comment placed directly **above** the token's declaration:

```css
/* @theme-template
   group: fine-tuning
   block: buttons
   label: button color
   example: #2563eb */
--button-bg: var(--primary);
```

Fields:

| field     | required | meaning |
|-----------|----------|---------|
| `group`   | yes      | top-level section: `brand`, `text`, or `fine-tuning` |
| `label`   | usually  | the plain-English comment shown above the token (omit for a bare value like `--card-radius`) |
| `example` | yes      | the commented-out example value consumers see |
| `block`   | no       | a sub-header within the section (`buttons`, `badges`, `inputs`, `cards`, `text-sizes`) |
| `order`   | no       | integer sort key within a group, lower first (defaults to source order) |
| `name`    | no       | the token name — inferred from the declaration below the marker; **required only for standalone markers** (see below) |

The section/sub-header **prose and ordering** are presentation chrome the
generator owns (the `GROUPS` and `BLOCKS` tables in `scripts/generate_template.py`),
because they're stable scaffolding, not per-token data. The markers own the part
that actually drifts: *which* tokens are exposed and their label/example.

### Standalone markers (tokens with no source line)

A few exposed tokens — the `--text-xs`…`--text-4xl` size ramp — ride Tailwind's
built-in `--text-*` theme keys and have **no declaration of their own** in the
CSS. They can't sit above a line that doesn't exist, so they're written as
self-naming one-line markers (note the explicit `name:`):

```css
/* @theme-template name: --text-xs group: text block: text-sizes example: 0.75rem label: tiny labels */
```

Keeping these in the source (rather than a hidden config list) means the source
files remain the single source of truth for everything a consumer can override.

## The workflow

Whenever tokens changed (or someone asks if the template is current):

1. **Report drift** — generates the template from the markers and compares it to
   the file on disk:
   ```bash
   python3 .claude/skills/theme-template-sync/scripts/generate_template.py packages/ui/src/styles
   ```
   It prints tokens to **ADD** (exposed in source, missing from the template),
   tokens to **REMOVE** (in the template, no longer exposed), example values to
   **UPDATE**, plus a unified diff. Exit code is non-zero on drift, so it doubles
   as a CI/pre-commit gate. A rename shows up as one REMOVE + one ADD — call that
   out to the user as a rename rather than a delete+add.

2. **Show the user what drifted and why**, then get confirmation before writing.
   This file is consumer-facing; surfacing the change (especially removals, which
   break a client's existing override) matters more than speed.

3. **Regenerate** once confirmed:
   ```bash
   python3 .claude/skills/theme-template-sync/scripts/generate_template.py packages/ui/src/styles --write
   ```

`--show` prints the generated template to stdout without touching the file —
handy for previewing.

### The common case: design-tokens just added a knob

This is the main reason the skill exists. After `design-tokens` adds a
consumer-overridable token (a tier-3 component knob, or a new semantic role
clients should control), the token won't reach the template until it has a
marker. Add one above the new declaration, pick its `group`/`block`/`label`/
`example`, then regenerate. Mirror the nearest existing marker for style.

Decide whether a new token is *consumer-facing* before marking it — the template
is a curated subset, not every token. Internal knobs (e.g. the `*-bg-hover`
tokens, which derive from the base color via `color-mix`) deliberately have **no
marker**: a marker is opt-in, so leaving it off is how you keep something out of
the public surface. When unsure whether a token belongs to consumers, ask;
that's a design-tokens / product call, not a mechanical one.

## What counts as drift

- **Missing** — a marked token isn't in the template yet → added.
- **Stale** — the template lists a token whose marker is gone → removed.
- **Renamed** — surfaces as remove + add; preserve the intent (the new name
  inherits the old token's role).
- **Example-value drift (non-colors only)** — when a marker's `example` no
  longer matches the token's concrete source default (e.g. `--radius` changes
  from `0.625rem` to `0.75rem`), the script flags it. Update the marker's
  `example:` field to match. **Colors are exempt on purpose:** the template's
  color examples are a generic illustrative hex (a neutral `#2563eb` blue), not
  the real brand value — the brand is amber/gold oklch, and exposing the real
  oklch isn't the template's job. Don't resolve oklch→hex here; color *values*
  are the color-tokens skill's domain.

## Bootstrapping (no markers yet)

If the generator reports *"No @theme-template markers found"*, the source hasn't
been seeded. Seed markers by reverse-engineering the **current** `_template.css`:
each token in it maps to a definition in `semantic.css` / `components.css` — add
a marker above that definition carrying the token's existing comment (→ `label`),
its example value (→ `example`), and its section (→ `group`/`block`). Markers go
**only** on `semantic.css` and `components.css` tokens; never on `primitives.css`
(those are internal — the script errors if it finds a marker there) and never on
a token clients shouldn't touch.

## Boundaries with the other token skills

- **design-tokens** owns tier placement, naming, and Tailwind wiring. It decides
  *whether* a token exists and where; this skill decides whether it's *exposed to
  consumers* and keeps the template matching. Run this right after it.
- **color-tokens** owns oklch values and WCAG contrast. This skill never computes
  or converts color values — template color examples stay illustrative.
- **storybook-sync** keeps the *Storybook* docs current; this keeps the *consumer
  template* current. A token change can warrant both.

## What "done" looks like

- The generator reports `✓ _template.css is in sync with the source markers.`
- Every consumer-overridable token has a marker; nothing internal does.
- New tokens have a sensible `group`/`block`/`label`/`example`; removals were
  surfaced to the user (they break existing client overrides).
- `design-tokens`' `check_tokens.py` still passes (markers are comments and
  don't affect it, but confirm after large edits).
