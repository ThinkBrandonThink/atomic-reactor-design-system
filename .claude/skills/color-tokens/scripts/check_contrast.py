#!/usr/bin/env python3
"""WCAG 2.x AA contrast checker for the Atomic Reactor oklch token system.

Why this exists: WCAG contrast is defined on sRGB relative luminance, but this
repo authors colors in oklch. Eyeballing whether an oklch pair clears 4.5:1 is
not something to guess at when schools require AA. This converts oklch (and
hex/rgb/hsl) to luminance exactly and reports measured ratios.

Modes:
  # Audit every meaningful token pair in globals.css, light + dark:
  python check_contrast.py audit packages/ui/src/styles/globals.css

  # Check two arbitrary colors (any CSS color format):
  python check_contrast.py pair "oklch(0.852 0.199 91.936)" "#fff" --kind text

  # Convert any CSS color to the oklch this repo uses:
  python check_contrast.py to-oklch "#1d9bf0"

Thresholds (WCAG 2.0/2.1/2.2 are identical for color):
  text     4.5:1   (1.4.3 normal text)
  large    3.0:1   (1.4.3 text >=24px, or >=18.66px bold)
  nontext  3.0:1   (1.4.11 UI components, borders, focus rings, icons)
"""
import sys, re, math, argparse

# ---------- color parsing ----------

def _srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def _hex_to_rgb(s):
    s = s.lstrip("#")
    if len(s) == 3:
        s = "".join(ch * 2 for ch in s)
    if len(s) == 8:  # #rrggbbaa
        r, g, b, a = (int(s[i:i+2], 16) for i in (0, 2, 4, 6))
        return (r/255, g/255, b/255), a/255
    r, g, b = (int(s[i:i+2], 16) for i in (0, 2, 4))
    return (r/255, g/255, b/255), 1.0

def _hsl_to_rgb(h, s, l):
    h = (h % 360) / 360.0
    def hue(p, q, t):
        if t < 0: t += 1
        if t > 1: t -= 1
        if t < 1/6: return p + (q - p) * 6 * t
        if t < 1/2: return q
        if t < 2/3: return p + (q - p) * (2/3 - t) * 6
        return p
    if s == 0:
        return (l, l, l)
    q = l * (1 + s) if l < 0.5 else l + s - l * s
    p = 2 * l - q
    return (hue(p, q, h + 1/3), hue(p, q, h), hue(p, q, h - 1/3))

def _oklch_to_linear_rgb(L, C, H):
    h = math.radians(H)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
    g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
    bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
    return (max(0.0, min(1.0, r)), max(0.0, min(1.0, g)), max(0.0, min(1.0, bl)))

def _linear_rgb_to_oklch(r, g, bl):
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*bl
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*bl
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*bl
    l_, m_, s_ = (v ** (1/3) if v >= 0 else -((-v) ** (1/3)) for v in (l, m, s))
    L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_
    a = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_
    b = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
    C = math.hypot(a, b)
    H = math.degrees(math.atan2(b, a)) % 360
    return L, C, H

def parse_color(s):
    """Return (linear_rgb tuple, alpha). Accepts oklch/hex/rgb(a)/hsl(a)."""
    s = s.strip()
    m = re.match(r"oklch\(\s*([^)]+)\)", s, re.I)
    if m:
        parts = re.split(r"[\s,/]+", m.group(1).strip())
        L = float(parts[0].rstrip("%")) / (100 if "%" in parts[0] else 1)
        C = float(parts[1]) if len(parts) > 1 else 0.0
        H = float(parts[2]) if len(parts) > 2 else 0.0
        alpha = 1.0
        if len(parts) > 3:
            alpha = float(parts[3].rstrip("%")) / (100 if "%" in parts[3] else 1)
        return _oklch_to_linear_rgb(L, C, H), alpha
    if s.startswith("#"):
        (r, g, b), a = _hex_to_rgb(s)
        return (_srgb_to_linear(r), _srgb_to_linear(g), _srgb_to_linear(b)), a
    m = re.match(r"rgba?\(\s*([^)]+)\)", s, re.I)
    if m:
        parts = re.split(r"[\s,/]+", m.group(1).strip())
        def chan(p):
            return float(p.rstrip("%")) / 100 if "%" in p else float(p) / 255
        r, g, b = chan(parts[0]), chan(parts[1]), chan(parts[2])
        a = float(parts[3].rstrip("%")) / (100 if "%" in parts[3] else 1) if len(parts) > 3 else 1.0
        return (_srgb_to_linear(r), _srgb_to_linear(g), _srgb_to_linear(b)), a
    m = re.match(r"hsla?\(\s*([^)]+)\)", s, re.I)
    if m:
        parts = re.split(r"[\s,/]+", m.group(1).strip())
        h = float(parts[0].rstrip("deg"))
        sat = float(parts[1].rstrip("%")) / 100
        lit = float(parts[2].rstrip("%")) / 100
        r, g, b = _hsl_to_rgb(h, sat, lit)
        a = float(parts[3].rstrip("%")) / (100 if "%" in parts[3] else 1) if len(parts) > 3 else 1.0
        return (_srgb_to_linear(r), _srgb_to_linear(g), _srgb_to_linear(b)), a
    raise ValueError(f"Unrecognized color: {s!r}")

# ---------- contrast ----------

def luminance(linear_rgb):
    r, g, b = linear_rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def composite(fg_lin, alpha, bg_lin):
    """Composite a translucent foreground over an opaque background (linear)."""
    return tuple(f * alpha + b * (1 - alpha) for f, b in zip(fg_lin, bg_lin))

def contrast(fg_str, bg_str):
    """Contrast ratio of fg over bg. bg is assumed opaque; fg alpha composited."""
    fg_lin, fa = parse_color(fg_str)
    bg_lin, _ = parse_color(bg_str)
    if fa < 1.0:
        fg_lin = composite(fg_lin, fa, bg_lin)
    l1, l2 = luminance(fg_lin), luminance(bg_lin)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

THRESHOLDS = {"text": 4.5, "large": 3.0, "nontext": 3.0, "status": 4.5, "fill": 4.5}

# Foreground assumed for "solid fill" checks. Most fills in this system pair a
# saturated color with near-white text; --primary is the exception (dark amber
# text), but for status/brand fills white is the common, riskiest assumption.
WHITE = "oklch(0.985 0 0)"

# Semantic/state colors that ship without a -foreground partner. They are
# commonly used as colored text or icons (e.g. `text-destructive`), so the audit
# checks them as text over the page background — the usage where they most often
# fail. As a solid fill they pair with a separate foreground; that combination
# can't be inferred from the token alone, so it's flagged rather than measured.
STATUS_TOKENS = ["destructive", "success", "warning", "info"]

# ---------- globals.css parsing ----------

def parse_globals(path):
    """Return {'root': {token: value}, 'dark': {token: value}}."""
    text = open(path).read()
    out = {}
    for key, pat in (("root", r":root\s*\{([^}]*)\}"), ("dark", r"\.dark\s*\{([^}]*)\}")):
        m = re.search(pat, text, re.S)
        tokens = {}
        if m:
            for line in m.group(1).splitlines():
                lm = re.match(r"\s*--([\w-]+)\s*:\s*(.+?);", line)
                if lm and ("oklch" in lm.group(2) or "#" in lm.group(2)
                           or "rgb" in lm.group(2) or "hsl" in lm.group(2)):
                    tokens[lm.group(1)] = lm.group(2).strip()
        out[key] = tokens
    return out

def build_pairs(tokens):
    """Derive (label, fg_value, bg_value, kind) pairs from the resolved tokens.

    Inferred automatically: any `X-foreground` is text over `X`; bare
    `foreground` pairs with `background`. Then the structural non-text pairs AA
    1.4.11 cares about (borders, focus rings), the status colors (which ship
    without a `-foreground` partner) checked both as text and as a white-text
    fill, and the chart ramp checked as graphical objects against the canvas.
    """
    def v(tok):
        return tokens[tok]
    pairs = []
    for tok in tokens:
        if tok == "foreground" and "background" in tokens:
            pairs.append(("foreground / background", v("foreground"), v("background"), "text"))
        elif tok.endswith("-foreground"):
            base = tok[: -len("-foreground")]
            if base in tokens:
                pairs.append((f"{tok} / {base}", v(tok), v(base), "text"))
    # Non-text: surfaces these against the surface they sit on.
    nontext = [
        ("border / background", "border", "background"),
        ("input / background", "input", "background"),
        ("ring / background", "ring", "background"),
        ("sidebar-border / sidebar", "sidebar-border", "sidebar"),
        ("sidebar-ring / sidebar", "sidebar-ring", "sidebar"),
    ]
    for label, fg, bg in nontext:
        if fg in tokens and bg in tokens:
            pairs.append((label, v(fg), v(bg), "nontext"))
    # Status colors: as text/icon over the background, and as a white-text fill.
    for tok in STATUS_TOKENS:
        if tok in tokens and "background" in tokens:
            pairs.append((f"{tok} (as text) / background", v(tok), v("background"), "status"))
        if tok in tokens:
            pairs.append((f"white text on {tok} (fill)", WHITE, v(tok), "fill"))
    # Chart ramp: graphical objects, must separate from the canvas (1.4.11).
    if "background" in tokens:
        for n in range(1, 6):
            tok = f"chart-{n}"
            if tok in tokens:
                pairs.append((f"{tok} / background", v(tok), v("background"), "nontext"))
    return pairs

def audit(path):
    data = parse_globals(path)
    overall_fail = 0
    for theme in ("root", "dark"):
        tokens = data[theme]
        if not tokens:
            continue
        print(f"\n=== {'light (:root)' if theme == 'root' else 'dark (.dark)'} ===")
        print(f"{'pair':<42}{'ratio':>7}  {'need':>5}  result")
        print("-" * 70)
        for label, fg, bg, kind in build_pairs(tokens):
            ratio = contrast(fg, bg)
            need = THRESHOLDS[kind]
            ok = ratio >= need
            if not ok:
                overall_fail += 1
            mark = "PASS" if ok else "FAIL"
            note = ""
            if kind in ("text", "status", "fill") and not ok and ratio >= THRESHOLDS["large"]:
                note = "  (passes only at large-text 3:1)"
            if kind == "status":
                note += "  [only if used as normal text/icon; as a fill, check vs its foreground]"
            if kind == "fill":
                note += "  [only if used as a solid fill with white/near-white text]"
            print(f"{label:<42}{ratio:>6.2f}:1  {need:>4}:1  {mark}{note}")
    print(f"\n{overall_fail} failing pair(s).")
    return 1 if overall_fail else 0

# ---------- cli ----------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("audit", help="audit all token pairs in a globals.css")
    a.add_argument("path")
    p = sub.add_parser("pair", help="check two colors")
    p.add_argument("fg"); p.add_argument("bg")
    p.add_argument("--kind", choices=THRESHOLDS, default="text")
    t = sub.add_parser("to-oklch", help="convert a CSS color to oklch")
    t.add_argument("color")
    args = ap.parse_args()

    if args.cmd == "audit":
        sys.exit(audit(args.path))
    if args.cmd == "pair":
        ratio = contrast(args.fg, args.bg)
        need = THRESHOLDS[args.kind]
        ok = ratio >= need
        print(f"{ratio:.2f}:1  (need {need}:1 for {args.kind})  {'PASS' if ok else 'FAIL'}")
        sys.exit(0 if ok else 1)
    if args.cmd == "to-oklch":
        lin, alpha = parse_color(args.color)
        L, C, H = _linear_rgb_to_oklch(*lin)
        a_str = f" / {alpha:.3g}" if alpha < 1 else ""
        print(f"oklch({L:.3f} {C:.3f} {H:.3f}{a_str})")
        sys.exit(0)

if __name__ == "__main__":
    main()
