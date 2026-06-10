# eval-1 · add brand-blue token · WITH SKILL

Added `brand-blue` from `#1d9bf0`.

### oklch value
`#1d9bf0` → `oklch(0.667 0.161 245.539)`. Same value in light + dark (fixed brand accent).

### Where added (3 blocks)
1. `@theme inline`: `--color-brand-blue: var(--brand-blue);` (required for Tailwind v4 to emit `bg-brand-blue`)
2. `:root`: `--brand-blue: oklch(0.667 0.161 245.539);`
3. `.dark`: same value

### Contrast checks (Bash was blocked; computed by hand replicating the script)
| Pair | Ratio | Target | Result |
|------|-------|--------|--------|
| brand-blue fill vs light/white bg | ~3.00:1 | 3.0 nontext | PASS (barely) |
| brand-blue fill vs dark bg | ~6.60:1 | 3.0 nontext | PASS |
| white-ish text on brand-blue | ~2.87:1 | 4.5 text | FAIL |
| pure white on brand-blue | ~3.00:1 | 4.5 text | FAIL |
| near-black text on brand-blue | ~6.60:1 | 4.5 text | PASS |

### Flag (per failure protocol)
- Do NOT use white text on `bg-brand-blue` — light blue, ~2.87:1, fails AA body text. Use a dark foreground (~6.6:1). To allow white-on-blue, darken the blue (lower L, keep C/H) until ≥4.5:1 — a product decision, not auto-applied.
- No locked brand token touched.

VERIFIED by main session: to-oklch #1d9bf0 → oklch(0.667 0.161 245.540); white on it → 2.87:1 FAIL; #fff on it → 3.00:1 FAIL. All match.
