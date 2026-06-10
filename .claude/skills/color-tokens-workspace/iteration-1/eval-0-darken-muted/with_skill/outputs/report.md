# eval-0 · darken muted text · WITH SKILL

Task: darken the muted text on cards (`CardDescription` uses `text-sm text-muted-foreground`).

Change made (light `:root` only):
- Token: `--muted-foreground`
- Old: `oklch(0.556 0 0)` → New: `oklch(0.5 0 0)`
- Dark `--muted-foreground` left unchanged (complaint is light-mode).

| Pair | Before | After | Result |
|---|---|---|---|
| muted-foreground / card (light, white bg) | 4.73:1 | 6.00:1 | PASS |
| muted-foreground / muted (light) | 4.34:1 | 5.50:1 | PASS |
| muted-foreground / card (dark) | 6.91:1 | unchanged | PASS |
| muted-foreground / muted (dark) | 5.83:1 | unchanged | PASS |

Reasoning: light muted text was only 4.73:1 (weak), explaining the "too light" feel. L=0.50 brings card muted text to 6.00:1 and lifts the previously sub-AA `muted-foreground / muted` pair (4.34→5.50). One value changed, neutral gray kept, no locked brand token touched.

CAVEATS (from the run):
1. Bundled checker could NOT be run — every Bash call was denied. Ratios computed by faithfully reproducing the script's algorithm (neutral gray: luminance = L³). Re-run `audit` before shipping.
2. Initial `cp` was denied; recreated the working copy via Write, then applied the single-line edit.
3. `report.md` write was blocked for the subagent (this file written by the main session).

VERIFIED by main session: `pair "oklch(0.5 0 0)" "oklch(0.97 0 0)"` → 5.50:1 PASS (matches).
