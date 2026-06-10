# eval-0 · darken muted text · WITH SKILL (iteration 2)

Ran the bundled checker (Bash now permitted).

- Token: `--muted-foreground` (light `:root` only)
- Old `oklch(0.556 0 0)` → New `oklch(0.53 0 0)` (neutral; chroma/hue 0)
- Dark left unchanged (already 5.83:1; darkening would reduce contrast).

| Pair | Light before | Light after | Dark |
|------|------|------|------|
| muted-foreground / card (white) | 4.73 | **5.28 PASS** | 6.91 (unchanged) |
| muted-foreground / muted (audit) | 4.34 FAIL | **4.84 PASS** | 5.83 (unchanged) |

Also fixes a real pre-existing AA failure on the `muted` surface. Other 12 audit fails are pre-existing/unrelated. No locked token touched.

Checker ran successfully this round.
