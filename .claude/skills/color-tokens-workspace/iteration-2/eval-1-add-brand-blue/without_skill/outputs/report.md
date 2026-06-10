# eval-1 · add brand-blue · CLEAN BASELINE (iteration 2)

Worked in isolated /tmp/ar-baseline. **Did NOT reference any skill** (clean).

- `#1d9bf0` → `oklch(0.667 0.161 245.540)` (exact, matches with-skill)
- Added to `@theme inline`, `:root`, `.dark`. No locked token touched.

Contrast (by hand): white on it 3.00 (large-text only / fails normal); black on it 7.00 PASS. Recommended dark foreground for AA.

STRONG clean baseline — matched the with-skill run on every assertion, including catching the white-on-blue failure, computed by hand without the checker.
