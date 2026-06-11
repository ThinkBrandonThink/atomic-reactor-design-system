import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { icons } from "lucide-react"

/**
 * Every prop a lucide icon component accepts. The first four are
 * lucide-specific; everything else is forwarded to the rendered `<svg>`, so any
 * valid SVG or React attribute works too. Values come straight from the
 * installed `lucide-react` (`Icon.mjs` / `defaultAttributes.mjs`).
 */
const iconAttributes = [
  {
    attr: "size",
    type: "number | string",
    def: "24",
    desc: "Width and height of the SVG, in pixels.",
  },
  {
    attr: "color",
    type: "string",
    def: '"currentColor"',
    desc: "Stroke color. Inherits the surrounding text color by default.",
  },
  {
    attr: "strokeWidth",
    type: "number | string",
    def: "2",
    desc: "Thickness of the icon's strokes.",
  },
  {
    attr: "absoluteStrokeWidth",
    type: "boolean",
    def: "false",
    desc: "Keep the stroke width constant when the icon is resized instead of scaling it.",
  },
  {
    attr: "className",
    type: "string",
    def: '""',
    desc: "Merged after the built-in `lucide` class. In this system, Tailwind `size-*` and `text-*` utilities are the idiomatic way to set size and color.",
  },
  {
    attr: "aria-label",
    type: "string",
    def: "—",
    desc: 'Names the icon for assistive tech. Providing it (or any a11y prop) removes the automatic `aria-hidden="true"`.',
  },
  {
    attr: "…SVG / React props",
    type: "SVGProps<SVGSVGElement>",
    def: "—",
    desc: "Any valid SVG or React prop — onClick, style, fill, ref, data-*, aria-* — is forwarded to the <svg> element.",
  },
]

/**
 * Attributes applied to the `<svg>` by default. Override any of them via the
 * props above (e.g. pass `fill` or `strokeLinecap` directly).
 */
const svgDefaults =
  'fill="none" · stroke="currentColor" · strokeWidth={2} · strokeLinecap="round" · strokeLinejoin="round" · viewBox="0 0 24 24" · aria-hidden="true"'

/** Live registry of every icon shipped with lucide-react, keyed by name. */
const iconEntries = Object.entries(icons)

/** A representative icon for the live attribute preview. */
const PreviewIcon = icons.Sparkles

function AttributePlayground() {
  const [size, setSize] = useState(48)
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [absoluteStrokeWidth, setAbsoluteStrokeWidth] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="bg-muted/40 flex size-28 shrink-0 items-center justify-center rounded-lg border">
        <PreviewIcon
          size={size}
          strokeWidth={strokeWidth}
          absoluteStrokeWidth={absoluteStrokeWidth}
        />
      </div>
      <div className="flex min-w-48 flex-col gap-3 text-xs">
        <label className="flex items-center gap-2">
          <span className="w-28">size: {size}</span>
          <input
            type="range"
            min={12}
            max={96}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">strokeWidth: {strokeWidth}</span>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.25}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={absoluteStrokeWidth}
            onChange={(e) => setAbsoluteStrokeWidth(e.target.checked)}
          />
          <span>absoluteStrokeWidth</span>
        </label>
      </div>
    </div>
  )
}

function IconGallery() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return iconEntries
    return iconEntries.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="space-y-6 text-left">
      <section className="bg-card text-card-foreground rounded-lg border p-4">
        <h3 className="text-sm font-medium">Icon attributes</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Icons are passed as children, not via a prop. Every icon accepts these
          props:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-1.5 pe-3 font-medium">Attribute</th>
                <th className="py-1.5 pe-3 font-medium">Type</th>
                <th className="py-1.5 pe-3 font-medium">Default</th>
                <th className="py-1.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {iconAttributes.map(({ attr, type, def, desc }) => (
                <tr key={attr} className="border-b last:border-0 align-top">
                  <td className="py-1.5 pe-3">
                    <code className="font-medium whitespace-nowrap">{attr}</code>
                  </td>
                  <td className="text-muted-foreground py-1.5 pe-3">
                    <code className="whitespace-nowrap">{type}</code>
                  </td>
                  <td className="text-muted-foreground py-1.5 pe-3">
                    <code className="whitespace-nowrap">{def}</code>
                  </td>
                  <td className="text-muted-foreground py-1.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          <span className="font-medium">SVG defaults:</span> {svgDefaults}
        </p>
        <div className="mt-4">
          <AttributePlayground />
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter icons by name…"
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-56 rounded-(--radius-lg) border px-2.5 text-sm outline-none focus-visible:ring-3"
          />
          <span className="text-muted-foreground text-xs">
            {filtered.length} of {iconEntries.length} icons
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-px overflow-hidden rounded-lg border bg-border">
          {filtered.map(([name, Icon]) => (
            <div
              key={name}
              title={name}
              className="bg-card flex flex-col items-center gap-1.5 p-2 text-center"
            >
              <Icon className="size-5" />
              <span className="text-muted-foreground w-full truncate text-[0.65rem] leading-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Icons",
  component: IconGallery,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'The complete lucide-react icon set used across the design system, plus every prop an icon accepts. Filter by name to find one, then import it: `import { IconName } from "lucide-react"`.',
      },
    },
  },
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {}
