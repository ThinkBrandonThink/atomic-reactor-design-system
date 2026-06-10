# eval-2 · audit palette · WITH SKILL (iteration 2)

Ran `check_contrast.py audit` (13 failing pairs). Read-only. **Now catches status colors** (the iteration-1 gap).

Real light-mode failures, all on non-locked tokens:
1. **`info` 3.60 / `success` 3.30 / `warning` 3.19 — FAIL as text** (NEW: caught via the status-color fix). Confirmed by checking real usage: `text-success` on `bg-success/10` across badge/button/alert/field. destructive 4.76 PASS.
2. `muted-foreground / muted` 4.34 — fix to oklch(0.53 0 0) → 4.84.
3. `sidebar-primary-foreground / sidebar-primary` 2.83 light / 1.85 dark — fix the foreground (amber fill is locked).
4. `ring` 2.59 / `sidebar-ring` 2.48 — focus rings under 3:1.
5. `input / background` 1.26 — field boundary (decouple from border).

Cosmetic/exempt: `border`/`sidebar-border` (decorative). All dark status colors pass.
1.4.1: status must carry a non-color cue.

Bottom line: close but not AA-clean; all fixes on non-locked tokens.
