import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

/**
 * Foundations / Typography
 *
 * The type system, in two layers. SEMANTIC ROLES (`--text-heading-lg/-md/-sm/-xs`,
 * `--text-body`/`-sm`, `--text-label`/`-sm`, `--text-caption`) are composite tokens defined
 * in `semantic.css` (`@theme inline`): each bundles a size, line-height, and
 * weight into one `text-<role>` utility — the recommended way to set type. They
 * compose from the RAW AXES below: Tailwind v4's own `--text-*` sizes,
 * `--font-weight-*`, `--leading-*`, and `--tracking-*` scales (overridable the
 * same way — see the comment in `semantic.css`). Family is its own set of
 * tokens: `--font-sans` (Inter Variable, the brand face — a plain `@theme` token
 * so a `.theme-*` override can swap it at runtime), `--font-heading` (an
 * `@theme inline` alias of `--font-sans`), and `--font-mono` (the monospace face
 * — like `--font-sans`, a plain `@theme` token, defaulting to the system mono
 * stack); the role tokens don't set family, so pair a heading role with
 * `font-heading`. Family samples read their resolved
 * value live from the DOM; the size/weight/leading/tracking values are canonical,
 * shown from data (see the note on `useComputed`).
 */

/**
 * Read a computed style property off a rendered sample element. Used ONLY for
 * font-family, which is themeable at runtime via --font-sans so the resolved
 * value is the meaningful one. Do NOT use this to display the size / weight /
 * leading / tracking scales: those are fixed tokens defined in rem, unitless
 * multipliers, or em, and getComputedStyle resolves them to px (and returns
 * "normal" for unset values) — which makes a consistent scale look arbitrary.
 * Show those canonical token values from data instead.
 */
function useComputed(prop: keyof CSSStyleDeclaration) {
  const ref = React.useRef<HTMLElement>(null)
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    if (!ref.current) return
    setValue(String(getComputedStyle(ref.current)[prop]))
  }, [prop])
  return [ref, value] as const
}

/* -------------------------------------------------------------------------- */
/* Font families                                                              */
/* -------------------------------------------------------------------------- */

const FAMILIES = [
  {
    name: "font-sans",
    cssVar: "--font-sans",
    className: "font-sans",
    role: "Body and UI text. The Atomic Reactor brand face, Inter Variable.",
  },
  {
    name: "font-heading",
    cssVar: "--font-heading",
    className: "font-heading",
    role: "Headings and titles (e.g. CardTitle). Aliases --font-sans by default.",
  },
  {
    name: "font-mono",
    cssVar: "--font-mono",
    className: "font-mono",
    role: "Code, monospaced numbers, and fixed-width text. Defaults to the system mono stack; consumer-themeable.",
  },
] as const

function FamilyRow({ family }: { family: (typeof FAMILIES)[number] }) {
  const [ref, value] = useComputed("fontFamily")
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-foreground text-sm font-medium">{family.name}</span>
        <code className="text-muted-foreground text-xs">{`var(${family.cssVar})`}</code>
      </div>
      <p ref={ref as React.Ref<HTMLParagraphElement>} className={`${family.className} text-2xl`}>
        The quick brown fox jumps over the lazy dog
      </p>
      <p className="text-muted-foreground text-sm">{family.role}</p>
      <code className="text-muted-foreground/80 truncate text-xs">{value}</code>
    </div>
  )
}

/**
 * Shared table shell for the type-scale, weight, and tracking lists. A real
 * <table> keeps every cell in a shared column — left-aligned, consistent width
 * across all rows — and reads as a table rather than a list. Mirrors the
 * attributes table in icons.stories.tsx.
 */
function ScaleTable({
  valueHeader,
  children,
}: {
  valueHeader: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="text-muted-foreground">
          <tr className="border-b">
            <th className="py-1.5 pe-6 text-xs font-medium">Utility</th>
            <th className="py-1.5 pe-6 text-xs font-medium">{valueHeader}</th>
            <th className="py-1.5 text-xs font-medium">Sample</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

/** Shared cell padding — gives each row a little vertical breathing room. */
const CELL = "py-3 pe-6 align-baseline"

/* -------------------------------------------------------------------------- */
/* Text roles (semantic composites)                                           */
/* -------------------------------------------------------------------------- */

// Semantic role tokens from semantic.css (@theme inline): each text-<role>
// utility bundles font-size / line-height / font-weight, resolving through the
// --type-* primitive ramp. Canonical values shown from data, not getComputedStyle.
// Class strings are literal so Tailwind's source scanner generates each utility.
const ROLES = [
  { name: "text-heading-lg", className: "text-heading-lg", value: "1.875rem / 1.2 / 600" },
  { name: "text-heading-md", className: "text-heading-md", value: "1.5rem / 1.2 / 600" },
  { name: "text-heading-sm", className: "text-heading-sm", value: "1.25rem / 1.2 / 600" },
  { name: "text-heading-xs", className: "text-heading-xs", value: "1rem / 1.2 / 600" },
  { name: "text-body", className: "text-body", value: "1rem / 1.5 / 400" },
  { name: "text-body-sm", className: "text-body-sm", value: "0.875rem / 1.5 / 400" },
  { name: "text-label", className: "text-label", value: "0.875rem / 1.5 / 500" },
  { name: "text-label-sm", className: "text-label-sm", value: "0.75rem / 1.5 / 500" },
  { name: "text-caption", className: "text-caption", value: "0.75rem / 1.5 / 400" },
] as const

function RoleRow({ role }: { role: (typeof ROLES)[number] }) {
  return (
    <tr className="border-b last:border-0">
      <td className={CELL}>
        <code className="text-muted-foreground text-xs whitespace-nowrap">{role.name}</code>
      </td>
      <td className={CELL}>
        <code className="text-muted-foreground/80 text-xs tabular-nums whitespace-nowrap">
          {role.value}
        </code>
      </td>
      <td className="py-3 align-baseline">
        <span className={`${role.className} text-foreground`}>Atomic Reactor</span>
      </td>
    </tr>
  )
}

/* -------------------------------------------------------------------------- */
/* Type scale                                                                 */
/* -------------------------------------------------------------------------- */

// Canonical Tailwind --text-* tokens (font-size / line-height, both in rem).
// Shown as defined values, not getComputedStyle output, which would resolve to
// px and obscure the scale. Class strings are literal (not interpolated) so
// Tailwind's source scanner generates each utility — `text-${size}` would not.
const SIZES = [
  { name: "text-xs", className: "text-xs", value: "0.75rem / 1rem" },
  { name: "text-sm", className: "text-sm", value: "0.875rem / 1.25rem" },
  { name: "text-base", className: "text-base", value: "1rem / 1.5rem" },
  { name: "text-lg", className: "text-lg", value: "1.125rem / 1.75rem" },
  { name: "text-xl", className: "text-xl", value: "1.25rem / 1.75rem" },
  { name: "text-2xl", className: "text-2xl", value: "1.5rem / 2rem" },
  { name: "text-3xl", className: "text-3xl", value: "1.875rem / 2.25rem" },
  { name: "text-4xl", className: "text-4xl", value: "2.25rem / 2.5rem" },
  { name: "text-5xl", className: "text-5xl", value: "3rem / 3rem" },
] as const

function SizeRow({ size }: { size: (typeof SIZES)[number] }) {
  return (
    <tr className="border-b last:border-0">
      <td className={CELL}>
        <code className="text-muted-foreground text-xs whitespace-nowrap">{size.name}</code>
      </td>
      <td className={CELL}>
        <code className="text-muted-foreground/80 text-xs tabular-nums whitespace-nowrap">
          {size.value}
        </code>
      </td>
      <td className="py-3 align-baseline">
        <span className={`${size.className} text-foreground`}>Atomic Reactor</span>
      </td>
    </tr>
  )
}

/* -------------------------------------------------------------------------- */
/* Font weights                                                               */
/* -------------------------------------------------------------------------- */

// Canonical --font-weight-* token values (the CSS weight, 100–900).
const WEIGHTS = [
  { name: "font-thin", className: "font-thin", value: "100" },
  { name: "font-extralight", className: "font-extralight", value: "200" },
  { name: "font-light", className: "font-light", value: "300" },
  { name: "font-normal", className: "font-normal", value: "400" },
  { name: "font-medium", className: "font-medium", value: "500" },
  { name: "font-semibold", className: "font-semibold", value: "600" },
  { name: "font-bold", className: "font-bold", value: "700" },
  { name: "font-extrabold", className: "font-extrabold", value: "800" },
  { name: "font-black", className: "font-black", value: "900" },
] as const

function WeightRow({ weight }: { weight: (typeof WEIGHTS)[number] }) {
  return (
    <tr className="border-b last:border-0">
      <td className={CELL}>
        <code className="text-muted-foreground text-xs whitespace-nowrap">{weight.name}</code>
      </td>
      <td className={CELL}>
        <code className="text-muted-foreground/80 text-xs tabular-nums">{weight.value}</code>
      </td>
      <td className="py-3 align-baseline">
        <span className={`${weight.className} text-foreground text-xl`}>Atomic Reactor</span>
      </td>
    </tr>
  )
}

/* -------------------------------------------------------------------------- */
/* Line height (leading)                                                      */
/* -------------------------------------------------------------------------- */

// Canonical --leading-* token values (unitless line-height multipliers).
const LEADINGS = [
  { name: "leading-tight", className: "leading-tight", value: "1.25" },
  { name: "leading-snug", className: "leading-snug", value: "1.375" },
  { name: "leading-normal", className: "leading-normal", value: "1.5" },
  { name: "leading-relaxed", className: "leading-relaxed", value: "1.625" },
  { name: "leading-loose", className: "leading-loose", value: "2" },
] as const

const SAMPLE_PARAGRAPH =
  "The Atomic Reactor design system is built on Base UI primitives, styled with Tailwind CSS v4 and a three-tier token architecture so any brand can theme it end to end."

function LeadingCard({ leading }: { leading: (typeof LEADINGS)[number] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-baseline justify-between gap-2">
        <code className="text-muted-foreground text-xs">{leading.name}</code>
        <code className="text-muted-foreground/80 text-xs tabular-nums">{leading.value}</code>
      </div>
      <p className={`${leading.className} text-sm`}>{SAMPLE_PARAGRAPH}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Letter spacing (tracking)                                                  */
/* -------------------------------------------------------------------------- */

// letter-spacing is defined in `em` (relative to font size). Showing the token
// value is clearer than a px measurement, which would resolve em against the
// sample's font size and obscure the even ±0.025em scale.
const TRACKINGS = [
  { name: "tracking-tighter", className: "tracking-tighter", value: "-0.05em" },
  { name: "tracking-tight", className: "tracking-tight", value: "-0.025em" },
  { name: "tracking-normal", className: "tracking-normal", value: "0em" },
  { name: "tracking-wide", className: "tracking-wide", value: "0.025em" },
  { name: "tracking-wider", className: "tracking-wider", value: "0.05em" },
  { name: "tracking-widest", className: "tracking-widest", value: "0.1em" },
] as const

function TrackingRow({ tracking }: { tracking: (typeof TRACKINGS)[number] }) {
  return (
    <tr className="border-b last:border-0">
      <td className={CELL}>
        <code className="text-muted-foreground text-xs whitespace-nowrap">{tracking.name}</code>
      </td>
      <td className={CELL}>
        <code className="text-muted-foreground/80 text-xs tabular-nums">{tracking.value}</code>
      </td>
      <td className="py-3 align-baseline">
        <span className={`${tracking.className} text-foreground text-lg`}>ATOMIC REACTOR</span>
      </td>
    </tr>
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

function TypographySpecimen() {
  return (
    <div className="bg-background text-foreground flex w-full max-w-5xl flex-col p-4">
      <Section
        title="Font families"
        description="Three family tokens. --font-sans is the brand face (Inter Variable); --font-heading aliases it for titles; --font-mono is the monospace face for code and fixed-width text."
      >
        <div className="grid grid-cols-1 gap-3">
          {FAMILIES.map((family) => (
            <FamilyRow key={family.name} family={family} />
          ))}
        </div>
      </Section>

      <Section
        title="Text roles"
        description="Semantic composite tokens — each bundles size, line-height, and weight into one text-<role> utility. The recommended way to set type; the raw axes below are what they compose from. Pair heading roles with font-heading. Components use the compact end of the scale (heading-xs titles, body-sm descriptions, label/-sm, caption); the larger heading-sm/-md/-lg and body (1rem) are a display/reading scale for consumer app page content, not used by any component."
      >
        <ScaleTable valueHeader="Size / leading / weight">
          {ROLES.map((role) => (
            <RoleRow key={role.name} role={role} />
          ))}
        </ScaleTable>
      </Section>

      <Section
        title="Type scale"
        description="Tailwind's text-* scale — the raw sizes the roles compose from. Each row shows the utility and its resolved font-size / line-height."
      >
        <ScaleTable valueHeader="Size / line-height">
          {SIZES.map((size) => (
            <SizeRow key={size.name} size={size} />
          ))}
        </ScaleTable>
      </Section>

      <Section
        title="Font weights"
        description="Inter Variable carries the full weight axis. Components use normal, medium, semibold, and bold."
      >
        <ScaleTable valueHeader="Weight">
          {WEIGHTS.map((weight) => (
            <WeightRow key={weight.name} weight={weight} />
          ))}
        </ScaleTable>
      </Section>

      <Section
        title="Line height"
        description="The leading-* scale, applied to a paragraph so the spacing between lines is visible."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEADINGS.map((leading) => (
            <LeadingCard key={leading.name} leading={leading} />
          ))}
        </div>
      </Section>

      <Section
        title="Letter spacing"
        description="The tracking-* scale. Most useful on uppercase labels and small caps."
      >
        <ScaleTable valueHeader="Letter spacing">
          {TRACKINGS.map((tracking) => (
            <TrackingRow key={tracking.name} tracking={tracking} />
          ))}
        </ScaleTable>
      </Section>
    </div>
  )
}

const meta = {
  title: "Foundations/Typography",
  component: TypographySpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The type system of the Atomic Reactor design system: semantic text roles (text-heading-lg/-md/-sm/-xs, text-body/-sm, text-label/-sm, text-caption), the raw size scale they compose from, weights, line-heights, and letter-spacing. Roles and families are token-driven (--text-* role composites in semantic.css; --font-sans / --font-heading / --font-mono); the raw axes map to Tailwind v4's built-in scales. Family samples read their resolved value live from the DOM; scale values are canonical.",
      },
    },
  },
} satisfies Meta<typeof TypographySpecimen>

export default meta
type Story = StoryObj<typeof meta>

export const AllType: Story = {}
