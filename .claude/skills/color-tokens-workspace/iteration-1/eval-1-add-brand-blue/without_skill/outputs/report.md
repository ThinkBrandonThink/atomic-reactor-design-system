# eval-1 · add brand-blue token · BASELINE (no skill)

Added to copied globals.css:
1. `:root`: `--brand-blue: oklch(0.685 0.156 248.6);` (after `--warning`)
2. `.dark`: same value
3. `@theme inline`: `--color-brand-blue: var(--brand-blue);`

Usage suggested: `<div className="bg-brand-blue text-white">…</div>`

Notes:
- `#1d9bf0` converted to oklch.
- Locked brand tokens and structural top-of-file left untouched.
- Contrast caveat: value NOT run through a checker; says "if used as a text background, verify AA contrast before shipping."

KEY DIFFERENCE vs with-skill: baseline suggested `text-white` on `bg-brand-blue` — which is ~3.00:1 and FAILS AA body text. It did not check or flag this. The with-skill run caught it and recommended a dark foreground.

Also: baseline's oklch (0.685 0.156 248.6) is a slightly looser conversion than the exact 0.667 0.161 245.540.
