import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRight, Mail, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays a button or a component that looks like a button.",
      },
    },
  },
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

/**
 * Icons are passed as children, not via a prop — drop any `lucide-react` icon
 * in and the Button auto-sizes it (`size-4`, scaling down on `xs`/`sm`) and
 * colors it via `currentColor`. Add `data-icon="inline-start"` or
 * `data-icon="inline-end"` to the icon to trigger the optical padding tweak so
 * the icon edge doesn't sit too far from the button edge.
 */
export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass a lucide icon as a child. Use `data-icon=\"inline-start\"`/`\"inline-end\"` to tighten the padding on that side.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <Mail data-icon="inline-start" /> Email
      </Button>
      <Button {...args}>
        Continue <ArrowRight data-icon="inline-end" />
      </Button>
      <Button {...args} variant="secondary">
        <Plus data-icon="inline-start" /> Add item
      </Button>
    </div>
  ),
}

/**
 * Icon-only buttons use a square `icon` size variant. Always provide an
 * `aria-label` since there's no visible text.
 */
export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Square buttons for a single icon. Provide an `aria-label` for accessibility.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="icon-sm" aria-label="Add item">
        <Plus />
      </Button>
      <Button {...args} size="icon" aria-label="Add item">
        <Plus />
      </Button>
      <Button {...args} size="icon-lg" variant="outline" aria-label="Add item">
        <Plus />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
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
  { name: "--button-bg", affects: "Default variant background" },
  { name: "--button-fg", affects: "Default variant text" },
  { name: "--button-bg-hover", affects: "Default variant hover background" },
  { name: "--secondary", affects: "Secondary variant background" },
  { name: "--secondary-foreground", affects: "Secondary variant text" },
  { name: "--background", affects: "Outline variant background" },
  { name: "--border", affects: "Outline variant border" },
  { name: "--input", affects: "Outline border & background (dark mode)" },
  { name: "--muted", affects: "Outline & Ghost hover background" },
  {
    name: "--foreground",
    affects: "Outline & Ghost hover text · Secondary hover tint · Link text",
  },
  {
    name: "--destructive",
    affects: "Destructive variant · aria-invalid border & ring",
  },
  { name: "--ring", affects: "Focus-visible border & ring" },
]

const radiusTokens = [
  { name: "--radius", affects: "Base radius — rescales the entire system" },
  {
    name: "--radius-md",
    affects: "xs / sm / icon-xs / icon-sm corner radius",
  },
  {
    name: "--radius-lg",
    affects: "default / lg / icon corner radius (rounded-lg)",
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
 * Button's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Button. Swatches and values track the active light/dark theme.",
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
