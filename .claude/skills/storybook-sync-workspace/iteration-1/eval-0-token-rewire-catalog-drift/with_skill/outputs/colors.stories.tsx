import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

/**
 * Foundations / Colors
 *
 * Displays every color token exposed via the `@theme inline` blocks in
 * `semantic.css` (semantic roles) and `components.css` (tier-3 component knobs).
 * Each swatch renders the live `var(--token)` value, so toggling the Storybook
 * theme (light/dark) updates the swatches and the resolved oklch values in real
 * time.
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
  {
    title: "Component tokens",
    description:
      "Tier-3 per-component knobs from components.css — the public theming API. Each defaults to a semantic role but can be overridden per component without touching the rest of the system.",
    tokens: [
      { name: "button", cssVar: "--button-bg", foreground: "--button-fg" },
      { name: "button-hover", cssVar: "--button-bg-hover" },
      { name: "badge", cssVar: "--badge-bg", foreground: "--badge-fg" },
      { name: "badge-hover", cssVar: "--badge-bg-hover" },
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

function Swatch({ token }: { token: Token }) {
  const tick = useThemeTick()
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (!ref.current) return
    setValue(getComputedStyle(ref.current).backgroundColor)
  }, [tick])

  return (
    <div className="flex items-center gap-3 rounded-lg border p-2.5">
      <div
        ref={ref}
        className="flex size-12 shrink-0 items-center justify-center rounded-md border shadow-xs"
        style={{
          backgroundColor: `var(${token.cssVar})`,
          color: token.foreground ? `var(${token.foreground})` : undefined,
        }}
      >
        {token.foreground ? <span className="text-sm font-medium">Aa</span> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-medium">{token.name}</span>
        <code className="text-muted-foreground truncate text-xs">bg-{token.name}</code>
        <code className="text-muted-foreground/80 truncate text-xs tabular-nums">{value}</code>
      </div>
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
            {group.tokens.map((token) => (
              <Swatch key={token.cssVar} token={token} />
            ))}
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
          "All color design tokens from the Atomic Reactor design system — semantic roles plus the tier-3 component knobs. Each swatch shows its Tailwind utility, underlying CSS variable, and the live resolved value. Toggle the theme to see light/dark values.",
      },
    },
  },
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {}
