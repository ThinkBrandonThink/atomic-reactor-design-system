import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

/**
 * Foundations / Shadows
 *
 * The system uses Tailwind v4's built-in box-shadow scale (`--shadow-2xs` …
 * `--shadow-2xl`) — an elevation ramp from a barely-there hairline to a deep
 * overlay shadow. The design system layers no custom shadow tokens on top, so
 * this is the Tailwind ramp as the components consume it (cards, popovers,
 * dropdowns, dialogs). Higher elevation = larger, softer, more offset.
 *
 * Each card applies the live `shadow-*` utility; the value column shows the
 * canonical box-shadow definition from data. Shadows read very differently in
 * dark mode — press `d` to toggle the theme and compare.
 */

// Tailwind's box-shadow scale. `value` is the canonical box-shadow definition
// (shown from data, not measured). Class strings are literal so Tailwind's
// source scanner emits each utility.
const SHADOWS = [
  { name: "shadow-none", className: "shadow-none", value: "none" },
  { name: "shadow-2xs", className: "shadow-2xs", value: "0 1px rgb(0 0 0 / 0.05)" },
  { name: "shadow-xs", className: "shadow-xs", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  {
    name: "shadow-sm",
    className: "shadow-sm",
    value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  {
    name: "shadow-md",
    className: "shadow-md",
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  {
    name: "shadow-lg",
    className: "shadow-lg",
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  {
    name: "shadow-xl",
    className: "shadow-xl",
    value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  { name: "shadow-2xl", className: "shadow-2xl", value: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
] as const

function ShadowCard({ shadow }: { shadow: (typeof SHADOWS)[number] }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`bg-card border-border flex h-16 items-center justify-center rounded-lg border ${shadow.className}`}
      >
        <code className="text-foreground text-xs font-medium">{shadow.name}</code>
      </div>
      <code className="text-muted-foreground/80 text-[0.7rem] leading-snug break-all">
        {shadow.value}
      </code>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* In context — elevation lifting a panel off the page                        */
/* -------------------------------------------------------------------------- */

// A floating panel over page content, the way a popover or dropdown uses
// shadow to read as "above" the surface. Placeholder bars stand in for page
// content so the lift is visible.
function InContext() {
  return (
    <div className="bg-muted/40 relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl border p-6">
      <div aria-hidden className="absolute inset-6 flex flex-col gap-3 opacity-60">
        <div className="bg-muted-foreground/15 h-3 w-3/4 rounded-full" />
        <div className="bg-muted-foreground/15 h-3 w-full rounded-full" />
        <div className="bg-muted-foreground/15 h-3 w-2/3 rounded-full" />
        <div className="bg-muted-foreground/15 h-3 w-5/6 rounded-full" />
      </div>
      <div className="bg-popover text-popover-foreground relative flex w-60 flex-col gap-1 rounded-lg border p-2 shadow-lg">
        <div className="hover:bg-accent rounded-sm px-2 py-1.5 text-sm">Edit</div>
        <div className="hover:bg-accent rounded-sm px-2 py-1.5 text-sm">Duplicate</div>
        <div className="bg-border my-1 h-px" />
        <div className="text-destructive hover:bg-accent rounded-sm px-2 py-1.5 text-sm">
          Delete
        </div>
      </div>
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

function ShadowsSpecimen() {
  return (
    <div className="bg-background text-foreground flex w-full max-w-5xl flex-col p-4">
      <Section
        title="Elevation"
        description="Tailwind's box-shadow ramp, from shadow-2xs (hairline) to shadow-2xl (deep overlay). Cards apply the live shadow-* utility; the value below each is the canonical definition. Press d to compare light and dark."
      >
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {SHADOWS.map((shadow) => (
            <ShadowCard key={shadow.name} shadow={shadow} />
          ))}
        </div>
      </Section>

      <Section
        title="In context"
        description="Shadow is how a floating surface reads as 'above' the page — here shadow-lg lifts a menu off the content behind it."
      >
        <InContext />
      </Section>
    </div>
  )
}

const meta = {
  title: "Foundations/Shadows",
  component: ShadowsSpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Shadow / elevation foundations of the Atomic Reactor design system. The system uses Tailwind v4's built-in box-shadow scale (shadow-2xs … shadow-2xl) — no custom shadow tokens are layered on top. Cards render the live shadow-* utility; the box-shadow value beneath each is canonical, shown from data. Shadows read differently per theme — toggle dark mode to compare.",
      },
    },
  },
} satisfies Meta<typeof ShadowsSpecimen>

export default meta
type Story = StoryObj<typeof meta>

export const AllShadows: Story = {}
