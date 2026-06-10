# eval-0 · darken muted text · BASELINE (no skill)

Change (light theme `:root` only):
- `--muted-foreground`: `oklch(0.556 0 0)` → `oklch(0.53 0 0)` (lowered L only; neutral gray).

Why:
- "Muted text on cards" = `text-muted-foreground` on `--card` (white) in light mode. Darkened only the light value.
- Dark mode left unchanged.
- No locked brand tokens touched.

CAVEAT — contrast NOT verified: references the color-tokens skill and its script but states Bash was denied so the checker could not run. Notes `oklch(0.53 0 0)` is "the value the skill documents" (~4.84:1 on muted). Recommends running the checker before shipping.

NOTE (methodology): this baseline run referenced the color-tokens skill by name — the skill is discoverable in the agent's environment even though it wasn't told to use it. Baseline is partially contaminated.

VERIFIED by main session: `oklch(0.53 0 0)` on muted → 4.84:1 PASS.
