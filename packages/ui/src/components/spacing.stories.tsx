import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

/**
 * Foundations / Spacing
 *
 * The system uses Tailwind v4's built-in spacing scale, driven by one base
 * token, `--spacing: 0.25rem`. Every spacing utility — padding (`p-*`), margin
 * (`m-*`), gap (`gap-*`), width/height (`w-*`, `h-*`), inset (`top-*`, …) —
 * resolves to `calc(var(--spacing) * n)`, so the whole grid stays on a 4px
 * rhythm and a single token override rescales it. The design system adds no
 * custom spacing tokens on top of this; the table below is the canonical subset
 * the components actually reach for.
 *
 * Values are shown from data (rem and px at the stock --spacing), not measured
 * off the bars — the bar widths are the live token, the numbers are canonical.
 */

// A representative subset of Tailwind's spacing scale (it's continuous —
// every integer plus the half-steps). n is the multiplier against --spacing;
// rem = n × 0.25rem, px = rem × 16. Class strings are literal so Tailwind's
// source scanner emits each width utility.
const STEPS = [
  { step: "0", className: "w-0", rem: "0rem", px: "0px" },
  { step: "px", className: "w-px", rem: "—", px: "1px" },
  { step: "0.5", className: "w-0.5", rem: "0.125rem", px: "2px" },
  { step: "1", className: "w-1", rem: "0.25rem", px: "4px" },
  { step: "1.5", className: "w-1.5", rem: "0.375rem", px: "6px" },
  { step: "2", className: "w-2", rem: "0.5rem", px: "8px" },
  { step: "2.5", className: "w-2.5", rem: "0.625rem", px: "10px" },
  { step: "3", className: "w-3", rem: "0.75rem", px: "12px" },
  { step: "4", className: "w-4", rem: "1rem", px: "16px" },
  { step: "5", className: "w-5", rem: "1.25rem", px: "20px" },
  { step: "6", className: "w-6", rem: "1.5rem", px: "24px" },
  { step: "8", className: "w-8", rem: "2rem", px: "32px" },
  { step: "10", className: "w-10", rem: "2.5rem", px: "40px" },
  { step: "12", className: "w-12", rem: "3rem", px: "48px" },
  { step: "16", className: "w-16", rem: "4rem", px: "64px" },
  { step: "20", className: "w-20", rem: "5rem", px: "80px" },
  { step: "24", className: "w-24", rem: "6rem", px: "96px" },
] as const

function StepRow({ item }: { item: (typeof STEPS)[number] }) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2 pe-6 align-middle">
        <code className="text-muted-foreground text-xs whitespace-nowrap">{item.step}</code>
      </td>
      <td className="py-2 pe-6 align-middle">
        <code className="text-muted-foreground/80 text-xs tabular-nums whitespace-nowrap">
          {item.rem}
        </code>
      </td>
      <td className="py-2 pe-6 align-middle">
        <code className="text-muted-foreground/80 text-xs tabular-nums whitespace-nowrap">
          {item.px}
        </code>
      </td>
      <td className="py-2 align-middle">
        <div className={`bg-primary h-3 ${item.className}`} />
      </td>
    </tr>
  )
}

/* -------------------------------------------------------------------------- */
/* In context — the scale as padding and gap                                  */
/* -------------------------------------------------------------------------- */

// The muted frame is the spacing; the solid block is the content. Class strings
// are literal (not interpolated) so Tailwind's source scanner emits each utility.
const PADDINGS = [
  { name: "p-2", className: "p-2" },
  { name: "p-4", className: "p-4" },
  { name: "p-8", className: "p-8" },
] as const

const GAPS = [
  { name: "gap-2", className: "gap-2" },
  { name: "gap-4", className: "gap-4" },
  { name: "gap-8", className: "gap-8" },
] as const

function PaddingDemo({ item }: { item: (typeof PADDINGS)[number] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`bg-muted w-fit rounded-md ${item.className}`}>
        <div className="bg-primary h-10 w-20 rounded-sm" />
      </div>
      <code className="text-muted-foreground/80 text-xs">{item.name}</code>
    </div>
  )
}

function GapDemo({ item }: { item: (typeof GAPS)[number] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`bg-muted flex w-fit rounded-md p-2 ${item.className}`}>
        <div className="bg-primary h-10 w-10 rounded-sm" />
        <div className="bg-primary h-10 w-10 rounded-sm" />
        <div className="bg-primary h-10 w-10 rounded-sm" />
      </div>
      <code className="text-muted-foreground/80 text-xs">{item.name}</code>
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

function SpacingSpecimen() {
  return (
    <div className="bg-background text-foreground flex w-full max-w-5xl flex-col p-4">
      <Section
        title="Spacing scale"
        description="Tailwind's spacing scale: every step is calc(var(--spacing) * n) off the 0.25rem base, so padding, margin, gap, and sizing all share one 4px rhythm. The bars are the live token width; the rem/px columns are canonical."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-1.5 pe-6 text-xs font-medium">Step</th>
                <th className="py-1.5 pe-6 text-xs font-medium">rem</th>
                <th className="py-1.5 pe-6 text-xs font-medium">px</th>
                <th className="py-1.5 text-xs font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {STEPS.map((item) => (
                <StepRow key={item.step} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="In context"
        description="The same scale as padding and gap. The muted frame is the spacing; the solid block is the content."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end gap-6">
            {PADDINGS.map((item) => (
              <PaddingDemo key={item.name} item={item} />
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-6">
            {GAPS.map((item) => (
              <GapDemo key={item.name} item={item} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

const meta = {
  title: "Foundations/Spacing",
  component: SpacingSpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Spacing foundations of the Atomic Reactor design system. The system uses Tailwind v4's built-in spacing scale, driven by a single --spacing: 0.25rem base token — every p-*, m-*, gap-*, and sizing utility resolves to calc(var(--spacing) * n), keeping everything on a 4px rhythm. No custom spacing tokens are layered on top. Bars render the live token; rem/px values are canonical, shown from data.",
      },
    },
  },
} satisfies Meta<typeof SpacingSpecimen>

export default meta
type Story = StoryObj<typeof meta>

export const AllSpacing: Story = {}
