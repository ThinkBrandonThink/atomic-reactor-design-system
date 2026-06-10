# eval-1 · add brand-blue · WITH SKILL (iteration 2)

Ran the checker (`to-oklch`, `audit`).

- `#1d9bf0` → `oklch(0.667 0.161 245.540)`
- Added in 3 places: `@theme inline` (`--color-brand-blue`), `:root`, `.dark`.

Measured:
- white text on brand-blue: **3.00 FAIL** (large-text only)
- primary-foreground on it: 2.87 FAIL
- black/foreground on it: 6.60 PASS
- as non-text fill vs white bg: 3.00 PASS; vs dark: 6.60 PASS

Flag: too dark for white body text — pair with dark foreground, or reserve white for large text. Did not alter the incoming brand color (failure protocol). No locked token touched.
