# eval-2 · audit palette · CLEAN BASELINE (iteration 2)

Worked in isolated /tmp/ar-baseline. **Did NOT reference any skill** — wrote its own /tmp/contrast_check.mjs.

Went BROADER than the skill's audit. Found everything the with-skill run found PLUS:
- White-on-fill failures for success/info/warning/brand-blue in BOTH themes.
- Amber primary as text on white (1.57) and white-on-amber (1.50) — light-mode fails.
- **Chart ramp**: chart-1/chart-2 fail vs white (light); chart-5 fails vs dark — the skill's audit never checks charts.
- White data labels on lighter chart bars fail.

CAVEAT: ran on the shared /tmp/ar-baseline AFTER the concurrent eval-0/eval-1 baselines had mutated it (muted-foreground=0.45, brand-blue added) — it correctly noticed and reported this. So its muted-foreground reading (7.44 PASS) reflects the mutated value, not the real 0.556 (which fails).

KEY INSIGHT: a strong reasoning baseline surfaces more breadth than the script-driven audit. The skill's edge is reliability/consistency + brand-lock discipline, not breadth — and the audit could be widened (charts, white-on-fill).
