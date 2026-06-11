import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"

/**
 * Foundations / Radius
 *
 * One base token, `--radius` (the brand default, `0.625rem`, defined in
 * `semantic.css`), and a MULTIPLICATIVE scale derived from it via `calc()`:
 * `--radius-sm` … `--radius-4xl` (also in `semantic.css`, `@theme inline`).
 * Because every step is `var(--radius) × factor`, overriding the single base
 * token in a `.theme-*` file rescales the whole system at once. The tier-3
 * COMPONENT KNOBS at the bottom (`--button-radius`, `--card-radius`, …) each
 * default to one step of this scale, so a consumer can round one component
 * without touching the rest.
 *
 * Each row shows its canonical definition (the `calc()` factor) and the default
 * resolved value at the stock `--radius` — shown from data, not measured off the
 * sample, so the even scale reads as even. The swatch is the live token applied
 * via the `rounded-(--token)` syntax, so it reflects any runtime override.
 */

/* -------------------------------------------------------------------------- */
/* Radius scale                                                               */
/* -------------------------------------------------------------------------- */

// The multiplicative scale from semantic.css. `factor` is the calc() multiplier
// against --radius; `value` is the default resolved size at --radius: 0.625rem.
// Class strings are literal so Tailwind's source scanner emits each utility.
const SCALE = [
  { name: "--radius-sm", className: "rounded-(--radius-sm)", factor: "× 0.6", value: "0.375rem / 6px" },
  { name: "--radius-md", className: "rounded-(--radius-md)", factor: "× 0.8", value: "0.5rem / 8px" },
  { name: "--radius-lg", className: "rounded-(--radius-lg)", factor: "× 1.0", value: "0.625rem / 10px" },
  { name: "--radius-xl", className: "rounded-(--radius-xl)", factor: "× 1.4", value: "0.875rem / 14px" },
  { name: "--radius-2xl", className: "rounded-(--radius-2xl)", factor: "× 1.8", value: "1.125rem / 18px" },
  { name: "--radius-3xl", className: "rounded-(--radius-3xl)", factor: "× 2.2", value: "1.375rem / 22px" },
  { name: "--radius-4xl", className: "rounded-(--radius-4xl)", factor: "× 2.6", value: "1.625rem / 26px" },
] as const

function ScaleCard({ step }: { step: (typeof SCALE)[number] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className={`bg-primary/15 border-primary/40 h-12 w-full border ${step.className}`} />
      <div className="flex flex-col gap-0.5">
        <code className="text-foreground text-xs font-medium">{step.name}</code>
        <code className="text-muted-foreground/80 text-[0.7rem] tabular-nums">
          {step.factor} · {step.value}
        </code>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Component radius knobs (tier 3)                                            */
/* -------------------------------------------------------------------------- */

// Per-component knobs from components.css. Each defaults to one scale step; a
// consumer theme can override just one to restyle a single component.
const KNOBS = [
  { name: "--button-radius", className: "rounded-(--button-radius)", defaultsTo: "--radius-lg", value: "0.625rem" },
  { name: "--input-radius", className: "rounded-(--input-radius)", defaultsTo: "--radius-lg", value: "0.625rem" },
  { name: "--card-radius", className: "rounded-(--card-radius)", defaultsTo: "--radius-xl", value: "0.875rem" },
  { name: "--badge-radius", className: "rounded-(--badge-radius)", defaultsTo: "--radius-4xl", value: "1.625rem" },
] as const

function KnobCard({ knob }: { knob: (typeof KNOBS)[number] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className={`bg-secondary border-border h-12 w-full border ${knob.className}`} />
      <div className="flex flex-col gap-0.5">
        <code className="text-foreground text-xs font-medium">{knob.name}</code>
        <code className="text-muted-foreground/80 text-[0.7rem] tabular-nums">
          {knob.value} · {knob.defaultsTo}
        </code>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* In context — the real components each knob drives                          */
/* -------------------------------------------------------------------------- */

// Live design-system components. Each renders with its own radius knob, so the
// corners here are exactly what --button/input/card/badge-radius produce.
function InContext() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <ExampleTile token="--button-radius">
        <Button>Button</Button>
      </ExampleTile>
      <ExampleTile token="--input-radius">
        <Input className="w-44" placeholder="Input" />
      </ExampleTile>
      <ExampleTile token="--badge-radius">
        <Badge>Badge</Badge>
      </ExampleTile>
      <ExampleTile token="--card-radius">
        <Card className="w-56">
          <CardHeader>
            <CardTitle>Card</CardTitle>
            <CardDescription>Corners from --card-radius.</CardDescription>
          </CardHeader>
        </Card>
      </ExampleTile>
    </div>
  )
}

function ExampleTile({ token, children }: { token: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <code className="text-muted-foreground/80 text-xs">{token}</code>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 pt-10 first:pt-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </section>
  )
}

function RadiusSpecimen() {
  return (
    <div className="bg-background text-foreground flex w-full max-w-5xl flex-col p-4">
      <Section
        title="Radius scale"
        description="One base token (--radius) and a multiplicative scale derived from it. Override --radius alone and the whole scale rescales. Consumed via the rounded-(--token) syntax."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {SCALE.map((step) => (
            <ScaleCard key={step.name} step={step} />
          ))}
        </div>
      </Section>

      <Section
        title="Component knobs"
        description="Tier-3 tokens (components.css) — each defaults to one scale step. Override one in a .theme-* file to round a single component without touching the rest."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KNOBS.map((knob) => (
            <KnobCard key={knob.name} knob={knob} />
          ))}
        </div>
      </Section>

      <Section
        title="In context"
        description="The real components those knobs drive, rendered live — the corners here are exactly what the tokens produce."
      >
        <InContext />
      </Section>
    </div>
  )
}

const meta = {
  title: "Foundations/Radius",
  component: RadiusSpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Border-radius foundations of the Atomic Reactor design system: a single base token --radius and a multiplicative scale (--radius-sm … --radius-4xl) defined in semantic.css, plus the tier-3 per-component knobs (--button-radius, --input-radius, --card-radius, --badge-radius) in components.css. Overriding the base --radius rescales the whole system; overriding a knob restyles one component. Swatches apply the live token; factors and default values are canonical, shown from data.",
      },
    },
  },
} satisfies Meta<typeof RadiusSpecimen>

export default meta
type Story = StoryObj<typeof meta>

export const AllRadius: Story = {}
