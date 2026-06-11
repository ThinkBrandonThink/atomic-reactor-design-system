#!/usr/bin/env python3
"""
generate_template.py — regenerate themes/_template.css from @theme-template
markers in the source token files.

The consumer theme template (themes/_template.css) is the friendly,
hand-editable file clients fill in to restyle the app. It must expose exactly
the tokens a consumer is allowed to override — no more, no less — and it drifts
silently when tokens are added, removed, or renamed in semantic.css /
components.css. This script makes the template a DERIVED artifact: every token
in it comes from an `@theme-template` marker next to the token's definition in
the source, so the template can never diverge from what the source actually
exposes.

A marker looks like this (placed directly above the token's declaration):

    /* @theme-template
       group: brand
       label: Your main brand color (buttons, links, highlights)
       example: #2563eb */
    --primary: var(--gold-300);

Fields:
    group    (required)  which top-level section the token appears in
    label    (required)  the plain-English comment shown above the token
    example  (required)  the commented-out example value consumers see
    block    (optional)  a sub-header within the section (id from BLOCKS)
    order    (optional)  integer sort key within a group (lower = earlier)
    name     (optional)  the token name; inferred from the next declaration if
                         omitted. REQUIRED for "standalone" markers that don't
                         sit above a real declaration (e.g. Tailwind-native
                         --text-* size tokens, which have no source line).

The section/sub-header PROSE and ordering are presentation chrome owned by this
script (GROUPS / BLOCKS below) — they rarely change. The markers own the
per-token data that actually drifts.

Usage:
    generate_template.py <styles-dir>            # report drift (exit 1 if any)
    generate_template.py <styles-dir> --write     # regenerate the template
    generate_template.py <styles-dir> --show      # print generated to stdout
"""

import argparse
import difflib
import re
import sys
import textwrap
from pathlib import Path

# ---------------------------------------------------------------------------
# Presentation chrome — section + sub-header prose. This is the stable scaffold
# the template is rendered into; markers slot tokens into it by `group`/`block`.
# ---------------------------------------------------------------------------

HEADER = """\
/* ============================================================================
 * YOUR CUSTOM THEME
 * ----------------------------------------------------------------------------
 * This file lets you change the look of the app — your colors, your rounded
 * corners, your buttons — without anyone touching the code.
 *
 * How to use it:
 *   1. Fill in the values you want to change below.
 *   2. Upload this file in your admin settings.
 *   3. That's it — the new look is applied everywhere.
 *
 * A few simple rules:
 *   - Every line is optional. Anything you leave blank keeps the standard look.
 *   - The lines below are "turned off" by default — they sit between comment
 *     markers so the app ignores them. To use one, remove the comment markers
 *     at the start and end of that line, leaving just:   --primary: #2563eb;
 *   - Colors can be written as hex codes (e.g. #2563eb), the same codes you
 *     get from any color picker.
 *   - Keep the names on the left exactly as written. Only change the value on
 *     the right, and always end the line with a semicolon ;
 *
 * Tip: start with just the brand color. You can always add more later.
 *
 * NOTE: this file is generated from @theme-template markers in the source
 * token files. Don't hand-edit it — edit the markers and re-run the
 * theme-template-sync skill's generator.
 * ========================================================================== */"""

SELECTOR = ".theme-acme"

# Top-level sections, in render order. Each token's `group` field maps here.
GROUPS = [
    ("brand", """\
  /* ---- YOUR BRAND ---------------------------------------------------------
   * These set the overall look. The brand color flows into buttons, links,
   * highlights, and more — so this is usually the only thing you need.        */"""),
    ("text", """\
  /* ---- TEXT & FONTS -------------------------------------------------------
   * Change the typeface and how big the text is.
   * Note: a font only works if your site already loads it. Stick to common
   * web fonts (Arial, Georgia, "Times New Roman") unless your team has added
   * a custom one. Always keep a fallback after a comma, e.g. "Poppins", sans-serif. */"""),
    ("fine-tuning", """\
  /* ---- FINE-TUNING (optional) ---------------------------------------------
   * Already happy with the brand settings above? You can stop there.
   * The lines below change ONE thing at a time, if you want extra control.    */"""),
]

# Sub-headers within a group. A token's optional `block` field references a key
# here. `inline` blocks render each token compactly on one line (value + note),
# which suits short scannable ramps; otherwise the label sits above the value.
BLOCKS = {
    "text-sizes": {
        "header": """\
  /* Text sizes. These are the standard steps from smallest to largest —
     bump them up to make text bigger, down to make it smaller.
     "rem" is the unit: 1rem ≈ 16px, 1.25rem ≈ 20px, and so on. */""",
        "inline": True,
    },
    "buttons": {"header": "  /* Buttons */", "inline": True},
    "badges": {"header": "  /* Tags / badges */", "inline": True},
    "inputs": {"header": "  /* Input boxes (text fields) */", "inline": True},
    "cards": {"header": "  /* Cards (boxed sections of content) */", "inline": True},
}

KNOWN_FIELDS = {"name", "group", "block", "label", "example", "order"}
SOURCE_FILES = ["semantic.css", "components.css"]

# A value we can meaningfully compare a marker `example` against for drift: a
# bare length / number / keyword, not a var(), calc(), or color function.
_CONCRETE_LITERAL = re.compile(r"^-?[\d.]+(px|rem|em|%|vh|vw|deg|s|ms)?$|^0$|^none$")
_COLOR_EXAMPLE = re.compile(r"#|oklch|rgb|hsl", re.IGNORECASE)


class Marker:
    def __init__(self, name, fields, source_value, file, span):
        self.name = name
        self.group = fields.get("group")
        self.block = fields.get("block")
        self.label = fields.get("label", "")
        self.example = fields.get("example", "")
        self.order = int(fields["order"]) if fields.get("order", "").strip().lstrip("-").isdigit() else 100
        self.source_value = source_value  # the literal RHS of the declaration, if any
        self.file = file
        self.span = span  # (start, end) of the marker comment in the file text


def parse_markers(text, filename):
    """Find every @theme-template marker comment and the declaration (if any)
    immediately following it."""
    markers = []
    for m in re.finditer(r"/\*(.*?)\*/", text, re.DOTALL):
        body = m.group(1)
        # The marker keyword must lead the comment, so prose that merely
        # mentions "@theme-template" isn't mistaken for a marker.
        if not re.sub(r"^[\s*]*", "", body).startswith("@theme-template"):
            continue
        fields = _parse_fields(body)
        name = fields.get("name")
        source_value = None
        if not name:
            # infer from the next declaration after the comment
            tail = text[m.end():]
            decl = re.match(r"\s*--([\w-]+)\s*:\s*([^;]+);", tail)
            if decl:
                name = "--" + decl.group(1)
                source_value = decl.group(2).strip()
        markers.append(Marker(name, fields, source_value, filename, m.span()))
    return markers


def _parse_fields(body):
    """Parse `key: value` pairs from a marker body. A field's value runs until
    the next known key, so values may contain spaces, punctuation, and span
    lines (multi-field-per-line and one-field-per-line both work). Each known
    key is recognised only at a word boundary, so prose inside a label is safe
    as long as it doesn't contain a bare `<knownkey>:`."""
    body = body.replace("@theme-template", "", 1)
    body = re.sub(r"^\s*\*", "", body, flags=re.MULTILINE)  # strip comment stars
    key_re = re.compile(r"(?:^|\s)(" + "|".join(KNOWN_FIELDS) + r")\s*:", re.MULTILINE)
    hits = list(key_re.finditer(body))
    fields = {}
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(body)
        value = body[m.end():end]
        fields[m.group(1)] = re.sub(r"\s+", " ", value).strip()
    return fields


def _wrap_comment(label, indent="  "):
    """Render a label as a (possibly multi-line) CSS comment, continuation
    lines aligned under the text after the `/* `."""
    width = 78
    cont = indent + "   "  # align under the text after "/* "
    wrapped = textwrap.wrap(label, width=width - len(indent) - 3) or [""]
    if len(wrapped) == 1:
        return f"{indent}/* {wrapped[0]} */"
    lines = [f"{indent}/* {wrapped[0]}"]
    for w in wrapped[1:-1]:
        lines.append(f"{cont}{w}")
    lines.append(f"{cont}{wrapped[-1]} */")
    return "\n".join(lines)


def render_token(mk, inline):
    if inline:
        note = f"   {mk.label}" if mk.label else ""
        return f"  /* --{mk.name.lstrip('-')}: {mk.example};{note} */"
    parts = []
    if mk.label:
        parts.append(_wrap_comment(mk.label))
    parts.append(f"  /* --{mk.name.lstrip('-')}: {mk.example}; */")
    return "\n".join(parts)


def build_template(markers):
    """Render the full template text from parsed markers."""
    by_group = {}
    for mk in markers:
        by_group.setdefault(mk.group, []).append(mk)

    out = [HEADER, "", f"{SELECTOR} {{"]
    first_group = True
    for gkey, gheader in GROUPS:
        toks = by_group.get(gkey, [])
        if not toks:
            continue
        if not first_group:
            out.append("")
        first_group = False
        out.append(gheader)

        # Order: tokens with no block first (group order), then each block.
        # Within a bucket: by `order`, then source appearance.
        indexed = list(enumerate(toks))
        block_order = []
        for i, mk in indexed:
            key = mk.block or ""
            if key not in block_order:
                block_order.append(key)

        for bkey in block_order:
            bucket = [(i, mk) for i, mk in indexed if (mk.block or "") == bkey]
            bucket.sort(key=lambda im: (im[1].order, im[0]))
            inline = False
            if bkey:
                spec = BLOCKS.get(bkey)
                if spec is None:
                    raise SystemExit(f"error: unknown block id '{bkey}' "
                                     f"(token {bucket[0][1].name}). Add it to BLOCKS.")
                out.append("")
                out.append(spec["header"])
                inline = spec.get("inline", False)
            for _, mk in bucket:
                if not inline:
                    out.append("")
                out.append(render_token(mk, inline))
    out.append("}")
    return "\n".join(out) + "\n"


def check_marker_examples(markers):
    """Warn when a non-color marker `example` no longer matches the token's
    concrete source default — the example value has drifted."""
    drifted = []
    for mk in markers:
        if not mk.source_value or not mk.example:
            continue
        if _COLOR_EXAMPLE.search(mk.example):
            continue  # colors are illustrative, not the real brand value
        if not _CONCRETE_LITERAL.match(mk.source_value):
            continue  # var()/calc()/etc. — nothing concrete to compare
        if mk.example.strip() != mk.source_value.strip():
            drifted.append((mk, mk.source_value.strip()))
    return drifted


def parse_template_tokens(text):
    """Pull {name: example} from an existing template, for the drift report."""
    out = {}
    for m in re.finditer(r"/\*\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:.*?)\*/", text):
        out[m.group(1)] = m.group(2).strip()
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("styles_dir", help="path to packages/ui/src/styles")
    ap.add_argument("--write", action="store_true", help="regenerate the template file")
    ap.add_argument("--show", action="store_true", help="print generated template to stdout")
    args = ap.parse_args()

    styles = Path(args.styles_dir)
    template_path = styles / "themes" / "_template.css"

    # Markers must not live in the internal primitive tier.
    prim = styles / "primitives.css"
    if prim.exists() and "@theme-template" in prim.read_text():
        print("error: @theme-template marker found in primitives.css — primitives are "
              "internal and must never be exposed to consumers.", file=sys.stderr)
        return 2

    markers = []
    for fname in SOURCE_FILES:
        fpath = styles / fname
        if fpath.exists():
            markers.extend(parse_markers(fpath.read_text(), fname))

    if not markers:
        print("No @theme-template markers found in the source files.\n"
              "This repo hasn't been bootstrapped yet — seed markers above each\n"
              "consumer-overridable token (see the theme-template-sync skill).")
        return 1

    # Validate markers
    problems = []
    seen = {}
    for mk in markers:
        if not mk.name:
            problems.append(f"  - marker in {mk.file} has no name and no following declaration")
            continue
        if not mk.group:
            problems.append(f"  - {mk.name} ({mk.file}) is missing a `group`")
        if mk.group and mk.group not in {g for g, _ in GROUPS}:
            problems.append(f"  - {mk.name} ({mk.file}) has unknown group '{mk.group}'")
        if mk.name in seen:
            problems.append(f"  - {mk.name} is marked twice ({seen[mk.name]} and {mk.file})")
        seen[mk.name] = mk.file
    if problems:
        print("Marker problems:\n" + "\n".join(problems), file=sys.stderr)
        return 2

    generated = build_template(markers)

    if args.show:
        sys.stdout.write(generated)
        return 0

    existing = template_path.read_text() if template_path.exists() else ""

    # Source-default drift on marker examples (non-colors).
    drift = check_marker_examples(markers)
    if drift:
        print("Example values that no longer match the source default:")
        for mk, src in drift:
            print(f"  - {mk.name}: marker example `{mk.example}` vs source `{src}`")
        print("  (update the `example:` field in the marker to match.)\n")

    if generated == existing:
        print("✓ _template.css is in sync with the source markers.")
        return 0

    # Drift report — what changed at the token level.
    old_tokens = parse_template_tokens(existing)
    new_tokens = parse_template_tokens(generated)
    added = [t for t in new_tokens if t not in old_tokens]
    removed = [t for t in old_tokens if t not in new_tokens]
    changed = [t for t in new_tokens if t in old_tokens and new_tokens[t] != old_tokens[t]]

    print("✗ _template.css is OUT OF SYNC with the source markers.\n")
    if added:
        print("  Tokens to ADD (exposed in source, missing from template):")
        for t in added:
            print(f"    + {t}: {new_tokens[t]}")
    if removed:
        print("  Tokens to REMOVE (in template, no longer exposed in source):")
        for t in removed:
            print(f"    - {t}")
    if changed:
        print("  Example values to UPDATE:")
        for t in changed:
            print(f"    ~ {t}: {old_tokens[t]} → {new_tokens[t]}")
    if not (added or removed or changed):
        print("  (prose/formatting differences only)")

    if args.write:
        template_path.write_text(generated)
        print(f"\n→ wrote {template_path}")
        return 0

    print("\nUnified diff (run with --write to apply):\n")
    diff = difflib.unified_diff(
        existing.splitlines(keepends=True), generated.splitlines(keepends=True),
        fromfile="_template.css (current)", tofile="_template.css (generated)")
    sys.stdout.writelines(diff)
    return 1


if __name__ == "__main__":
    sys.exit(main())
