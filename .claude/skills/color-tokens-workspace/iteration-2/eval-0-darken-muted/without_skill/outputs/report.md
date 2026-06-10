# eval-0 · darken muted text · CLEAN BASELINE (iteration 2)

Worked in isolated /tmp/ar-baseline. **Did NOT reference any skill** (clean).

- Token: `--muted-foreground` light `:root`
- Old `oklch(0.556 0 0)` → New `oklch(0.45 0 0)` (neutral gray)
- Light only; left dark untouched (reasoned light is the "too light" case).

Verification: by hand from oklch (no checker available in the copy). Estimated ~6:1.
VERIFIED by main session: 0.45 on white = 7.44:1 PASS; on muted = 6.82:1 PASS. (Darker than needed — overshoots a bit, but compliant.)

Note: this is a true clean baseline — no skill, no checker. Hand math was directionally right.
