# eval-2 · audit palette · BASELINE (no skill)

Bash + file writes blocked; computed contrast by hand (oklch→OKLab→linear sRGB→luminance). Read-only.

## Verdict
Mostly AA for primary text, but **four light-mode pairs fail AA for normal text**, all status/semantic colors used as colored text:

| Light-mode pair | Contrast | Normal (4.5) |
|---|---|---|
| `warning` on `background` | 3.19 | FAIL |
| `success` on `background` | 3.30 | FAIL |
| `info` on `background` | 3.60 | FAIL |
| `muted-foreground` on `muted` | 4.34 | FAIL |

## Usage context
- `destructive` button is `text-destructive` on `bg-destructive/10` (not white-on-red) → 4.76 light / 6.84 dark; passes but tight.
- `success`/`info`/`warning` have NO `-foreground` token; as colored text on bg, three fail AA normal.
- Charts → 1.4.11 (3:1 non-text); `chart-1` (very light) is the likely thin-line risk on white.

## Recommendations
Don't use status colors as normal body text; darken them; watch dark `primary-foreground/primary` (4.54); add `-foreground` tokens for status fills; amber/teal LOCKED.

NOTE (methodology): references the bundled color-tokens checker and CLAUDE.md — the skill is discoverable, so this "baseline" is partially informed by the skill's existence. It also found status-color failures the skill's own audit script does NOT currently check (those tokens have no `-foreground` partner).

VERIFIED by main session: warning 3.19, success 3.30, info 3.60 (FAIL); destructive 4.76 (PASS) — all match.
