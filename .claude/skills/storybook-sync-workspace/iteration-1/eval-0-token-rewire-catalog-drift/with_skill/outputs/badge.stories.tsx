import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@workspace/ui/components/badge"
import { CheckIcon, XIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays a badge or a component that looks like a badge.",
      },
    },
  },
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "success",
        "info",
        "warning",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
  args: { children: "Badge", variant: "default" },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="destructive">
        Destructive
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="success">
        Success
      </Badge>
      <Badge {...args} variant="info">
        Info
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="ghost">
        Ghost
      </Badge>
      <Badge {...args} variant="link">
        Link
      </Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">
        <CheckIcon data-icon="inline-start" />
        Online
      </Badge>
      <Badge variant="destructive">
        <XIcon data-icon="inline-start" />
        Offline
      </Badge>
      <Badge variant="secondary">
        42
        <CheckIcon data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

/**
 * Reads the live computed value of a CSS custom property, re-reading whenever
 * the `.dark` class is toggled on <html> so values stay correct per theme.
 */
function useTokenValue(name: string) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const read = () =>
      setValue(
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim()
      )
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [name])

  return value
}

const colorTokens = [
  { name: "--badge-bg", affects: "Default variant background" },
  { name: "--badge-fg", affects: "Default variant text" },
  { name: "--badge-bg-hover", affects: "Default variant hover background (links)" },
  { name: "--secondary", affects: "Secondary variant background" },
  { name: "--secondary-foreground", affects: "Secondary variant text" },
  { name: "--border", affects: "Outline variant border" },
  { name: "--foreground", affects: "Outline variant text" },
  { name: "--muted", affects: "Outline & Ghost hover background" },
  {
    name: "--destructive",
    affects: "Destructive variant · aria-invalid border & ring",
  },
  { name: "--warning", affects: "Warning variant" },
  { name: "--success", affects: "Success variant" },
  { name: "--info", affects: "Info variant" },
  { name: "--ring", affects: "Focus-visible border & ring" },
]

const radiusTokens = [
  { name: "--radius", affects: "Base radius — rescales the entire system" },
  {
    name: "--badge-radius",
    affects: "Badge corner radius (defaults to --radius-4xl)",
  },
]

function ColorTokenRow({ name, affects }: { name: string; affects: string }) {
  const value = useTokenValue(name)
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="size-8 shrink-0 rounded-md border"
        style={{ backgroundColor: `var(${name})` }}
      />
      <div className="min-w-0">
        <code className="text-xs font-medium">{name}</code>
        <p className="text-muted-foreground truncate text-xs">{affects}</p>
      </div>
      <code className="text-muted-foreground ms-auto shrink-0 text-[0.7rem]">
        {value}
      </code>
    </div>
  )
}

function RadiusTokenRow({ name, affects }: { name: string; affects: string }) {
  const value = useTokenValue(name)
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="bg-muted size-8 shrink-0 border"
        style={{ borderRadius: `var(${name})` }}
      />
      <div className="min-w-0">
        <code className="text-xs font-medium">{name}</code>
        <p className="text-muted-foreground truncate text-xs">{affects}</p>
      </div>
      <code className="text-muted-foreground ms-auto shrink-0 text-[0.7rem]">
        {value}
      </code>
    </div>
  )
}

/**
 * Collapsible reference of every CSS custom property that influences the
 * Badge's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Badge. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => (
    <details className="bg-card text-card-foreground w-[28rem] max-w-full rounded-lg border p-4 text-left">
      <summary className="cursor-pointer text-sm font-medium select-none">
        CSS variables that affect this component
      </summary>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
            Colors
          </p>
          <div className="divide-y">
            {colorTokens.map((token) => (
              <ColorTokenRow key={token.name} {...token} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
            Radius
          </p>
          <div className="divide-y">
            {radiusTokens.map((token) => (
              <RadiusTokenRow key={token.name} {...token} />
            ))}
          </div>
        </div>
      </div>
    </details>
  ),
}
