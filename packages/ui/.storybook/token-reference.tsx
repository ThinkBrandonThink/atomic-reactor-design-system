import * as React from "react"

/**
 * Shared scaffolding for a component's "CSS variables that affect this
 * component" story. Mirrors the labels and grouped structure of the
 * Foundations/Colors catalog (`colors.stories.tsx`) — each token shows its
 * bare name, the Tailwind utility the component uses it through, and the live
 * resolved value, with bg/fg pairs carrying a WCAG AA contrast badge — but
 * adds a per-token `affects` line describing what the token does in *this*
 * component, and renders inside a collapsible `<details>` rather than the
 * fullscreen catalog grid.
 */

export type RefToken = {
  /** The CSS custom property, e.g. `--button-bg`. */
  cssVar: string
  /** What this token controls in this component. */
  affects: string
  /** The Tailwind utility the component uses it through, e.g. `bg-button`. */
  utility?: string
  /** Optional paired foreground token — renders a second chip + contrast badge. */
  foreground?: { cssVar: string; affects: string; utility?: string }
  /** Radius tokens preview a corner instead of a fill and report resolved length. */
  radius?: boolean
}

export type RefGroup = {
  title: string
  description?: string
  tokens: RefToken[]
}

/**
 * Re-reads computed values whenever the `.dark` class on <html> toggles, so
 * displayed values track the active theme.
 */
function useThemeTick() {
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const observer = new MutationObserver(() => setTick((t) => t + 1))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])
  return tick
}

/** Strip the leading `--` from a CSS custom property to get its token name. */
function varName(cssVar: string) {
  return cssVar.replace(/^--/, "")
}

/**
 * Normalize any computed CSS color string to an sRGB `[r, g, b]` triple by
 * painting it onto a 1×1 canvas — the browser does the color-space conversion.
 */
function toRgb(color: string): [number, number, number] | null {
  if (!color) return null
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = "#000"
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const { data } = ctx.getImageData(0, 0, 1, 1)
  return [data[0], data[1], data[2]]
}

/** WCAG 2.x relative luminance from an sRGB triple. */
function relativeLuminance([r, g, b]: [number, number, number]) {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG 2.x contrast ratio between two sRGB triples (symmetric, 1–21). */
function contrastRatio(a: [number, number, number], b: [number, number, number]) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Read an element's resolved background color as both a string and a triple. */
function readColor(el: HTMLElement) {
  const value = getComputedStyle(el).backgroundColor
  return { value, rgb: toRgb(value) }
}

/**
 * Contrast verdict against the WCAG 2.x AA thresholds (1.4.3): 4.5:1 for normal
 * text, 3:1 for large/bold text. Mirrors the `color-tokens` skill's checker.
 */
function ContrastBadge({ ratio }: { ratio: number | null }) {
  if (ratio == null) return null
  const passesText = ratio >= 4.5
  const passesLarge = ratio >= 3
  const label = passesText ? "AA" : passesLarge ? "AA large only" : "Fails AA"
  const tone = passesText
    ? "text-success border-success/30 bg-success/10"
    : passesLarge
      ? "text-warning border-warning/30 bg-warning/10"
      : "text-destructive border-destructive/30 bg-destructive/10"
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">Contrast</span>
      <code className="text-foreground tabular-nums">{ratio.toFixed(2)}:1</code>
      <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
        {label}
      </span>
    </div>
  )
}

/** A single token row: swatch + name, utility, affects, and resolved value. */
const Chip = React.forwardRef<
  HTMLDivElement,
  { cssVar: string; affects: string; utility?: string; value: string; radius?: boolean }
>(function Chip({ cssVar, affects, utility, value, radius }, ref) {
  return (
    <div className="flex items-center gap-3">
      <div
        ref={ref}
        className={radius ? "bg-muted size-10 shrink-0 border" : "size-10 shrink-0 rounded-md border shadow-xs"}
        style={radius ? { borderRadius: `var(${cssVar})` } : { backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-medium">{varName(cssVar)}</span>
        {utility ? <code className="text-muted-foreground truncate text-xs">{utility}</code> : null}
        <p className="text-muted-foreground truncate text-xs">{affects}</p>
        <code className="text-muted-foreground/80 truncate text-xs tabular-nums">{value}</code>
      </div>
    </div>
  )
})

/** A standalone color token with no paired foreground. */
function ColorSwatch({ token }: { token: RefToken }) {
  const tick = useThemeTick()
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    if (ref.current) setValue(readColor(ref.current).value)
  }, [tick])
  return (
    <div className="rounded-lg border p-2.5">
      <Chip ref={ref} cssVar={token.cssVar} affects={token.affects} utility={token.utility} value={value} />
    </div>
  )
}

/** A background/foreground token pair with the WCAG AA contrast of the pair. */
function PairSwatch({ token }: { token: RefToken & { foreground: NonNullable<RefToken["foreground"]> } }) {
  const tick = useThemeTick()
  const bgRef = React.useRef<HTMLDivElement>(null)
  const fgRef = React.useRef<HTMLDivElement>(null)
  const [bgValue, setBgValue] = React.useState("")
  const [fgValue, setFgValue] = React.useState("")
  const [ratio, setRatio] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!bgRef.current || !fgRef.current) return
    const bg = readColor(bgRef.current)
    const fg = readColor(fgRef.current)
    setBgValue(bg.value)
    setFgValue(fg.value)
    setRatio(bg.rgb && fg.rgb ? contrastRatio(bg.rgb, fg.rgb) : null)
  }, [tick])
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-2.5">
      <Chip ref={bgRef} cssVar={token.cssVar} affects={token.affects} utility={token.utility} value={bgValue} />
      <Chip
        ref={fgRef}
        cssVar={token.foreground.cssVar}
        affects={token.foreground.affects}
        utility={token.foreground.utility}
        value={fgValue}
      />
      <ContrastBadge ratio={ratio} />
    </div>
  )
}

/** A radius token: previews the resolved corner radius. */
function RadiusSwatch({ token }: { token: RefToken }) {
  const tick = useThemeTick()
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).borderRadius)
  }, [tick])
  return (
    <div className="rounded-lg border p-2.5">
      <Chip ref={ref} cssVar={token.cssVar} affects={token.affects} utility={token.utility} value={value} radius />
    </div>
  )
}

/**
 * The collapsible reference of every CSS custom property that influences a
 * component, grouped into titled sections like the Foundations/Colors catalog.
 * Swatches and values update live with the active light/dark theme.
 */
export function TokenReference({ groups }: { groups: RefGroup[] }) {
  return (
    <details className="bg-card text-card-foreground w-[28rem] max-w-full rounded-lg border p-4 text-left">
      <summary className="cursor-pointer text-sm font-medium select-none">
        CSS variables that affect this component
      </summary>
      <div className="mt-4 flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              {group.description ? (
                <p className="text-muted-foreground text-xs">{group.description}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              {group.tokens.map((token) =>
                token.radius ? (
                  <RadiusSwatch key={token.cssVar} token={token} />
                ) : token.foreground ? (
                  <PairSwatch
                    key={token.cssVar}
                    token={{ ...token, foreground: token.foreground }}
                  />
                ) : (
                  <ColorSwatch key={token.cssVar} token={token} />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </details>
  )
}
