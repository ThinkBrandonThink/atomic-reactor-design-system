import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

/**
 * Foundations / Colors
 *
 * Displays the color tokens of the three-tier system. Tier 2 (semantic role
 * tokens — `--primary`, `--background`, …) lives in `semantic.css`; tier 3
 * (per-component knobs — `--button-bg`, `--badge-bg`, …, the public theming
 * API) lives in `components.css`. Both are wired into Tailwind via `@theme
 * inline`. Tier 1 (the raw palette in `primitives.css`) is internal and not
 * shown here. Each swatch renders the live `var(--token)` value, so toggling
 * the Storybook theme (light/dark) updates the swatches and the resolved oklch
 * values in real time.
 */

type Token = {
  /** The Tailwind theme key, e.g. `primary` → usable as `bg-primary`. */
  name: string
  /** The underlying CSS custom property, e.g. `--primary`. */
  cssVar: string
  /** Optional paired foreground token, rendered as overlaid text. */
  foreground?: string
}

type TokenGroup = {
  title: string
  description?: string
  tokens: Token[]
}

const GROUPS: TokenGroup[] = [
  {
    title: "Base",
    description: "Page background and default text color.",
    tokens: [{ name: "background", cssVar: "--background", foreground: "--foreground" }],
  },
  {
    title: "Surfaces",
    description: "Elevated containers layered over the background.",
    tokens: [
      { name: "card", cssVar: "--card", foreground: "--card-foreground" },
      { name: "popover", cssVar: "--popover", foreground: "--popover-foreground" },
    ],
  },
  {
    title: "Brand & Neutrals",
    description: "Interactive and emphasis colors. Primary is the Atomic Reactor amber.",
    tokens: [
      { name: "primary", cssVar: "--primary", foreground: "--primary-foreground" },
      { name: "primary-link", cssVar: "--primary-link" },
      { name: "secondary", cssVar: "--secondary", foreground: "--secondary-foreground" },
      { name: "muted", cssVar: "--muted", foreground: "--muted-foreground" },
      { name: "accent", cssVar: "--accent", foreground: "--accent-foreground" },
    ],
  },
  {
    title: "Status",
    description: "Semantic feedback colors.",
    tokens: [
      { name: "destructive", cssVar: "--destructive" },
      { name: "success", cssVar: "--success" },
      { name: "info", cssVar: "--info" },
      { name: "warning", cssVar: "--warning" },
    ],
  },
  {
    title: "Component tokens",
    description:
      "Per-component knobs (tier 3) — the public theming API. Each defaults to a semantic token, so a .theme-* override can restyle one component in isolation.",
    tokens: [
      { name: "button", cssVar: "--button-bg", foreground: "--button-fg" },
      { name: "button-hover", cssVar: "--button-bg-hover" },
      { name: "badge", cssVar: "--badge-bg", foreground: "--badge-fg" },
      { name: "badge-hover", cssVar: "--badge-bg-hover" },
    ],
  },
  {
    title: "Borders & Inputs",
    description: "Outlines, field borders, and focus rings.",
    tokens: [
      { name: "border", cssVar: "--border" },
      { name: "input", cssVar: "--input" },
      { name: "ring", cssVar: "--ring" },
    ],
  },
  {
    title: "Charts",
    description: "Teal/cyan data-visualization ramp.",
    tokens: [
      { name: "chart-1", cssVar: "--chart-1" },
      { name: "chart-2", cssVar: "--chart-2" },
      { name: "chart-3", cssVar: "--chart-3" },
      { name: "chart-4", cssVar: "--chart-4" },
      { name: "chart-5", cssVar: "--chart-5" },
    ],
  },
  {
    title: "Sidebar",
    description: "Tokens scoped to the sidebar surface.",
    tokens: [
      { name: "sidebar", cssVar: "--sidebar", foreground: "--sidebar-foreground" },
      {
        name: "sidebar-primary",
        cssVar: "--sidebar-primary",
        foreground: "--sidebar-primary-foreground",
      },
      {
        name: "sidebar-accent",
        cssVar: "--sidebar-accent",
        foreground: "--sidebar-accent-foreground",
      },
      { name: "sidebar-border", cssVar: "--sidebar-border" },
      { name: "sidebar-ring", cssVar: "--sidebar-ring" },
    ],
  },
]

/**
 * Re-reads computed CSS variable values whenever the `.dark` class on <html>
 * toggles, so the displayed oklch values track the active theme.
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
 * Normalize any computed CSS color string (`rgb(...)`, `oklch(...)`, …) to an
 * sRGB `[r, g, b]` triple (0–255) by painting it onto a 1×1 canvas — the
 * browser does the color-space conversion so we don't have to.
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

/** A single color square + its name, utility, and resolved value. */
const ColorChip = React.forwardRef<
  HTMLDivElement,
  { cssVar: string; utility: string; value: string }
>(function ColorChip({ cssVar, utility, value }, ref) {
  return (
    <div className="flex items-center gap-3">
      <div
        ref={ref}
        className="size-12 shrink-0 rounded-md border shadow-xs"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-medium">{varName(cssVar)}</span>
        <code className="text-muted-foreground truncate text-xs">{utility}</code>
        <code className="text-muted-foreground/80 truncate text-xs tabular-nums">{value}</code>
      </div>
    </div>
  )
})

/** A standalone token with no paired foreground. */
function Swatch({ token }: { token: Token }) {
  const tick = useThemeTick()
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (!ref.current) return
    setValue(readColor(ref.current).value)
  }, [tick])

  return (
    <div className="flex items-center rounded-lg border p-2.5">
      <ColorChip cssVar={token.cssVar} utility={`bg-${token.name}`} value={value} />
    </div>
  )
}

/**
 * A background/foreground token pair, shown as two separate swatches with the
 * WCAG AA contrast ratio of the relationship between them.
 */
function PairSwatch({ token }: { token: Token & { foreground: string } }) {
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
      <ColorChip ref={bgRef} cssVar={token.cssVar} utility={`bg-${token.name}`} value={bgValue} />
      <ColorChip
        ref={fgRef}
        cssVar={token.foreground}
        utility={`text-${varName(token.foreground)}`}
        value={fgValue}
      />
      <ContrastBadge ratio={ratio} />
    </div>
  )
}

function ColorPalette() {
  return (
    <div className="bg-background text-foreground flex w-full max-w-5xl flex-col p-4">
      {GROUPS.map((group) => (
        <section key={group.title} className="flex flex-col gap-3 pt-10 first:pt-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{group.title}</h2>
            {group.description ? (
              <p className="text-muted-foreground text-sm">{group.description}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) =>
              token.foreground ? (
                <PairSwatch key={token.cssVar} token={{ ...token, foreground: token.foreground }} />
              ) : (
                <Swatch key={token.cssVar} token={token} />
              )
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: "Foundations/Colors",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "All color design tokens from the Atomic Reactor design system. Each swatch shows its Tailwind utility, underlying CSS variable, and the live resolved value. Toggle the theme to see light/dark values.",
      },
    },
  },
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {}
