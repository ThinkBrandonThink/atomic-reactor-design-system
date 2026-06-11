import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@workspace/ui/components/badge"
import { CheckIcon, XIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

const tokenGroups: RefGroup[] = [
  {
    title: "Component knobs",
    description:
      "Tier-3 knobs (the public theming API) — override to restyle the default Badge in isolation.",
    tokens: [
      {
        cssVar: "--badge-bg",
        utility: "bg-badge",
        affects: "Default variant background",
        foreground: {
          cssVar: "--badge-fg",
          utility: "text-badge-fg",
          affects: "Default variant text",
        },
      },
      {
        cssVar: "--badge-bg-hover",
        utility: "bg-badge-hover",
        affects: "Default variant hover background (link badges)",
      },
    ],
  },
  {
    title: "Variant colors",
    description: "Semantic tokens used by the secondary / status / outline / ghost / link variants.",
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
      { cssVar: "--destructive", utility: "text-destructive", affects: "Destructive variant text & background tint" },
      { cssVar: "--warning", utility: "text-warning", affects: "Warning variant text & background tint" },
      { cssVar: "--success", utility: "text-success", affects: "Success variant text & background tint" },
      { cssVar: "--info", utility: "text-info", affects: "Info variant text & background tint" },
      { cssVar: "--border", utility: "border-border", affects: "Outline variant border" },
      { cssVar: "--foreground", utility: "text-foreground", affects: "Outline variant text" },
      { cssVar: "--muted", utility: "bg-muted", affects: "Outline & Ghost hover background" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Outline & Ghost hover text" },
      { cssVar: "--primary-link", utility: "text-primary-link", affects: "Link variant text" },
    ],
  },
  {
    title: "Focus",
    description: "Focus-visible outline shared by every variant.",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--badge-radius",
        utility: "rounded-(--badge-radius)",
        affects: "Badge corner radius — pill shape (defaults to --radius-4xl)",
        radius: true,
      },
    ],
  },
]

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
  render: () => <TokenReference groups={tokenGroups} />,
}
