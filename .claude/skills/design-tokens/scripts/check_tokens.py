#!/usr/bin/env python3
"""
check_tokens.py — tier-integrity & wiring validator for the Atomic Reactor
3-tier CSS token system (primitives -> semantic -> components -> consumer themes).

Why this exists: Tailwind v4 + Vite silently produces broken styles when a
`var()` points at a token that doesn't exist, when a color token is never wired
into `@theme inline` (so no `bg-`/`text-` utility is generated), or when a tier
reaches past the one above it. `tsc`/`eslint` never see any of this — it's CSS.
This script is the missing build check.

Usage:
  # Audit the whole token system (run after ANY token edit):
  python3 check_tokens.py packages/ui/src/styles

  # Validate a single consumer theme file (e.g. an uploaded .theme-* override):
  python3 check_tokens.py packages/ui/src/styles --theme packages/ui/src/styles/themes/acme.css

Exit code is non-zero if any ERROR is found, so it doubles as a CI/pre-commit gate.
WARNINGS are printed but don't fail the run (they flag things to eyeball, not breakage).
"""

import argparse
import os
import re
import sys

# Tailwind v4 theme namespaces + framework-provided custom properties. A var()
# pointing at one of these is fine even though we don't define it — Tailwind does.
# (We still catch typos of OUR tokens, because those don't match these prefixes.)
TAILWIND_PREFIXES = (
    "--tw-", "--default-", "--color-", "--radius-", "--text-", "--font-",
    "--leading-", "--tracking-", "--font-weight-", "--breakpoint-",
    "--container-", "--shadow-", "--inset-shadow-", "--drop-shadow-",
    "--blur-", "--ease-", "--animate-", "--perspective-", "--aspect-",
)
TAILWIND_EXACT = {"--spacing", "--radius"}

# Tailwind theme-namespace tokens a CONSUMER theme is allowed to override
# (these are the runtime-overridable knobs the friendly template exposes).
CONSUMER_THEME_ALLOWED_TAILWIND = re.compile(
    r"^--(radius|font-sans|font-heading|text-[\w-]+|font-weight-[\w-]+|leading-[\w-]+|shadow-[\w-]+)$"
)

DEFINE_RE = re.compile(r"(--[A-Za-z0-9-]+)\s*:\s*([^;{}]+);")
VAR_RE = re.compile(r"var\(\s*(--[A-Za-z0-9-]+)")
COLOR_RE = re.compile(r"oklch|oklab|color-mix|rgba?\(|hsla?\(|#[0-9a-fA-F]{3,8}\b")
# A bare color has no length units; a box-shadow / spacing value does. That's how
# we tell a real color token (which needs a --color-* utility) apart from a
# composite value that merely CONTAINS a color, e.g. `0 1px 2px oklch(...)`.
# Composites are consumed via `prop-(--token)` syntax, not color utilities.
LENGTH_RE = re.compile(r"\d*\.?\d+(px|rem|em|ch|vh|vw|vmin|vmax|pt|pc|cm|mm|in)\b")
NONCOLOR_NAME = re.compile(r"-(shadow|elevation|radius|spacing|gap|width|size|duration|delay|index|z|inset)$")
SELECTOR_BLOCK_RE = re.compile(r"([^{}]+)\{([^{}]*)\}")


def strip_comments(text):
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return strip_comments(f.read())


def find_blocks(text):
    """Yield (selector, body) for every top-level `selector { ... }`.
    Good enough for these flat token files (no nested rules)."""
    return [(m.group(1).strip(), m.group(2)) for m in SELECTOR_BLOCK_RE.finditer(text)]


def defs_in(text):
    """All `--name: value;` definitions -> dict name -> last value (str)."""
    out = {}
    for name, value in DEFINE_RE.findall(text):
        out[name] = value.strip()
    return out


def refs_in(value):
    return VAR_RE.findall(value)


class Report:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.notes = []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def note(self, msg):
        self.notes.append(msg)

    def emit(self):
        for n in self.notes:
            print(f"  · {n}")
        for w in self.warnings:
            print(f"  ⚠ WARN  {w}")
        for e in self.errors:
            print(f"  ✗ ERROR {e}")
        print()
        total = len(self.errors)
        if total:
            print(f"FAIL — {total} error(s), {len(self.warnings)} warning(s).")
        else:
            print(f"OK — 0 errors, {len(self.warnings)} warning(s).")
        return 1 if total else 0


def is_external(name):
    return name in TAILWIND_EXACT or any(name.startswith(p) for p in TAILWIND_PREFIXES)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("styles_dir", help="path to packages/ui/src/styles")
    ap.add_argument("--theme", help="validate a single consumer .theme-* file and exit")
    args = ap.parse_args()

    sd = args.styles_dir
    paths = {
        "primitives": os.path.join(sd, "primitives.css"),
        "semantic": os.path.join(sd, "semantic.css"),
        "components": os.path.join(sd, "components.css"),
        "globals": os.path.join(sd, "globals.css"),
    }
    for tier, p in paths.items():
        if tier != "globals" and not os.path.exists(p):
            print(f"missing required file: {p}", file=sys.stderr)
            return 2

    text = {t: (read(p) if os.path.exists(p) else "") for t, p in paths.items()}

    # --- Definitions per tier -------------------------------------------------
    prim = defs_in(text["primitives"])

    # semantic.css: separate the @theme inline EXPOSURE mappings from the real
    # semantic role tokens (defined in :root / .dark).
    sem = {}            # tier-2 role tokens
    color_mappings = {} # `--color-X` -> source var name `--Y`, from any @theme inline
    theme_ns = {}       # other @theme tokens (--radius-*, --font-*, ...)
    for sel, body in find_blocks(text["semantic"]):
        d = defs_in(body)
        if "@theme" in sel:
            for name, value in d.items():
                if name.startswith("--color-"):
                    src = refs_in(value)
                    color_mappings[name] = src[0] if src else None
                else:
                    theme_ns[name] = value
        else:
            sem.update(d)

    comp = {}           # tier-3 component tokens (in :root)
    for sel, body in find_blocks(text["components"]):
        d = defs_in(body)
        if "@theme" in sel:
            for name, value in d.items():
                if name.startswith("--color-"):
                    src = refs_in(value)
                    color_mappings[name] = src[0] if src else None
                else:
                    theme_ns[name] = value
        else:
            comp.update(d)

    # globals.css may define a stray token (rare) — fold in for resolution.
    glob = defs_in(text["globals"])

    all_defs = {}
    for d in (prim, sem, comp, theme_ns, glob):
        all_defs.update(d)
    # The --color-* mappings are also defined names.
    for n in color_mappings:
        all_defs.setdefault(n, "")

    exposed_color_sources = {v for v in color_mappings.values() if v}

    def resolve(name, seen=None):
        """Follow a single var() chain to a leaf value string (for color detection)."""
        seen = seen or set()
        if name in seen:
            return ""
        seen.add(name)
        val = all_defs.get(name, "")
        m = re.fullmatch(r"\s*var\(\s*(--[A-Za-z0-9-]+)\s*\)\s*", val)
        if m:
            return resolve(m.group(1), seen)
        return val

    def is_color(name):
        # A color token needs a --color-* mapping to generate bg-/text- utilities.
        # But a composite property (box-shadow, spacing) can CONTAIN a color
        # without being one — those are consumed via `prop-(--token)`, not
        # utilities, so don't flag them. A length unit or a non-color name suffix
        # is the tell.
        if NONCOLOR_NAME.search(name):
            return False
        val = all_defs.get(name, "")
        resolved = resolve(name)
        if LENGTH_RE.search(val) or LENGTH_RE.search(resolved):
            return False
        return bool(COLOR_RE.search(val)) or bool(COLOR_RE.search(resolved))

    # === SINGLE-THEME MODE ====================================================
    if args.theme:
        print(f"Validating consumer theme: {args.theme}\n")
        rep = Report()
        ttext = read(args.theme)
        blocks = find_blocks(ttext)
        if not blocks:
            rep.note("No uncommented overrides found (every line is still commented out).")
        public = set(sem) | set(comp)
        for sel, body in blocks:
            if ".theme-" not in sel and ":root" not in sel:
                rep.warn(f"override block uses selector `{sel.strip()}` — consumer themes should be scoped to a `.theme-*` class.")
            for name, value in defs_in(body).items():
                if name in prim:
                    rep.err(f"`{name}` is a PRIMITIVE (tier 1, internal). A theme must only override public tokens "
                            f"(semantic roles or component knobs), never the raw palette.")
                elif name in public or CONSUMER_THEME_ALLOWED_TAILWIND.match(name):
                    pass  # legit public override
                elif name.startswith("--color-") or name in color_mappings:
                    rep.err(f"`{name}` is an internal Tailwind mapping, not an override target. "
                            f"Override the source role/knob instead (e.g. `--primary`, `--button-bg`).")
                else:
                    rep.warn(f"`{name}` matches no known public token — typo, or a token that doesn't exist? "
                             f"It will have no effect.")
        print("Reminder: run the color-tokens skill's contrast checker on any brand/foreground "
              "pair this theme sets, to confirm WCAG AA in both light and dark.")
        return rep.emit()

    # === FULL AUDIT MODE ======================================================
    print("Atomic Reactor token audit — primitives → semantic → components → themes\n")
    rep = Report()
    rep.note(f"{len(prim)} primitives, {len(sem)} semantic roles, {len(comp)} component knobs, "
             f"{len(color_mappings)} --color-* utility mappings.")

    # 1. Tier-reference integrity — each tier may only reach the tier(s) ABOVE it.
    for name, value in sem.items():
        for ref in refs_in(value):
            if ref in comp:
                rep.err(f"semantic `{name}` references component token `{ref}` — semantic (tier 2) must not "
                        f"depend on a component knob (tier 3). Invert the dependency.")
    for name, value in comp.items():
        for ref in refs_in(value):
            if ref in prim:
                rep.err(f"component `{name}` references raw primitive `{ref}` directly — a component knob (tier 3) "
                        f"must default to a SEMANTIC role (tier 2), e.g. `var(--primary)`, not the raw palette.")
    for name, value in prim.items():
        for ref in refs_in(value):
            if ref in sem or ref in comp:
                rep.err(f"primitive `{name}` references `{ref}` from a higher tier — primitives (tier 1) must be "
                        f"self-contained raw values.")

    # 2. Undefined var() references (typos / deleted tokens) anywhere in the tiers.
    for tier_name, d in (("primitives", prim), ("semantic", sem),
                         ("components", comp), ("@theme", theme_ns)):
        for name, value in d.items():
            for ref in refs_in(value):
                if ref not in all_defs and not is_external(ref):
                    rep.err(f"{tier_name} `{name}` references `{ref}`, which is not defined anywhere. "
                            f"Broken var() — Tailwind will emit an invalid value silently.")
    # orphaned exposure mappings
    for cname, src in color_mappings.items():
        if src is None:
            rep.warn(f"`{cname}` maps to no var() — check the @theme inline entry.")
        elif src not in all_defs and not is_external(src):
            rep.err(f"`{cname}: var({src})` — source `{src}` is not defined. The `{cname.replace('--color-', '')}` "
                    f"utility will be broken.")

    # 3. Color tokens must be EXPOSED via a --color-* mapping or they generate no utility.
    for tier_name, d in (("semantic", sem), ("component", comp)):
        for name in d:
            if name.startswith("--color-"):
                continue
            if is_color(name) and name not in exposed_color_sources:
                rep.warn(f"{tier_name} color token `{name}` is not wired into any `@theme inline` `--color-*` "
                         f"mapping, so no `bg-`/`text-`/`border-` utility exists for it. Add "
                         f"`--color-{name[2:]}: var({name});` (radius/spacing tokens are exempt — they use the "
                         f"`rounded-(--token)` arbitrary syntax instead).")

    # 4. Tier-3 naming convention: --{component}-{knob}[-{state}], lowercase kebab.
    components_dir = os.path.normpath(os.path.join(sd, "..", "components"))
    known = set()
    if os.path.isdir(components_dir):
        known = {os.path.splitext(f)[0] for f in os.listdir(components_dir) if f.endswith(".tsx")}
    for name in comp:
        stem = name[2:]
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", stem):
            rep.err(f"component token `{name}` is not lowercase-kebab — tier-3 names are a public stability "
                    f"contract and must read `--component-knob[-state]` (e.g. `--button-bg-hover`).")
            continue
        head = stem.split("-")[0]
        if known and head not in known:
            rep.warn(f"component token `{name}` starts with `{head}`, which isn't a component in "
                     f"packages/ui/src/components/. Intended a different prefix (e.g. `--button-…`)?")

    return rep.emit()


if __name__ == "__main__":
    sys.exit(main())
