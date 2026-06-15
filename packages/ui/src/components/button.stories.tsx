import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRight, Mail, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
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
 * in and the Button auto-sizes it (`size-4`, scaling down to `size-3.5` on `xs`
 * and up to `size-5` on `lg`) and colors it via `currentColor`. Add
 * `data-icon="inline-start"` or
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

const tokenGroups: RefGroup[] = [
  {
    title: "Component knobs",
    description:
      "Tier-3 knobs (the public theming API) — override to restyle the default Button in isolation.",
    tokens: [
      {
        cssVar: "--button-bg",
        utility: "bg-button",
        affects: "Default variant background",
        foreground: {
          cssVar: "--button-fg",
          utility: "text-button-fg",
          affects: "Default variant text",
        },
      },
      {
        cssVar: "--button-bg-hover",
        utility: "bg-button-hover",
        affects: "Default variant hover background",
      },
    ],
  },
  {
    title: "Variant colors",
    description: "Semantic tokens used by the outline / secondary / ghost / destructive / link variants.",
    tokens: [
      {
        cssVar: "--secondary",
        utility: "bg-secondary",
        affects: "Secondary variant background",
        foreground: {
          cssVar: "--secondary-foreground",
          utility: "text-secondary-foreground",
          affects: "Secondary variant text",
        },
      },
      { cssVar: "--background", utility: "bg-background", affects: "Outline variant background" },
      { cssVar: "--border", utility: "border-border", affects: "Outline variant border" },
      { cssVar: "--input", utility: "border-input", affects: "Outline border & background (dark mode)" },
      { cssVar: "--muted", utility: "bg-muted", affects: "Outline & Ghost hover background" },
      {
        cssVar: "--foreground",
        utility: "text-foreground",
        affects: "Outline & Ghost hover text · Secondary hover tint",
      },
      { cssVar: "--primary-link", utility: "text-primary-link", affects: "Link variant text" },
      {
        cssVar: "--destructive",
        utility: "text-destructive",
        affects: "Destructive variant · aria-invalid border & ring",
      },
    ],
  },
  {
    title: "Focus",
    description: "Focus-visible outline shared by every variant.",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
  {
    title: "Radius",
    description: "Corner radius. --button-radius is the tier-3 knob; the smaller sizes step down through the radius scale.",
    tokens: [
      {
        cssVar: "--button-radius",
        utility: "rounded-(--button-radius)",
        affects: "sm / default / lg / icon / icon-sm / icon-lg corner radius (defaults to --radius-lg)",
        radius: true,
      },
      { cssVar: "--radius", affects: "Base radius — rescales the entire system", radius: true },
      {
        cssVar: "--radius-md",
        utility: "rounded-[min(--radius-md,…)]",
        affects: "xs / icon-xs corner radius",
        radius: true,
      },
    ],
  },
]

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
  render: () => <TokenReference groups={tokenGroups} />,
}
