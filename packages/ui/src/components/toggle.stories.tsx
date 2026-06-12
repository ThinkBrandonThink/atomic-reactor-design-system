import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bold, Italic, Underline } from "lucide-react"
import { Toggle } from "@workspace/ui/components/toggle"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "A two-state button that can be either on or off.",
      },
    },
  },
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
  args: { variant: "default", size: "default" },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
}

export const WithText: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  ),
}

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle underline">
      <Underline />
    </Toggle>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} size="sm" aria-label="Small">
        <Bold />
      </Toggle>
      <Toggle {...args} size="default" aria-label="Default">
        <Bold />
      </Toggle>
      <Toggle {...args} size="lg" aria-label="Large">
        <Bold />
      </Toggle>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle variant="default" aria-label="Default bold">
        <Bold />
      </Toggle>
      <Toggle variant="outline" aria-label="Outline italic">
        <Italic />
      </Toggle>
      <Toggle variant="outline" defaultPressed aria-label="Pressed underline">
        <Underline />
      </Toggle>
      <Toggle disabled aria-label="Disabled bold">
        <Bold />
      </Toggle>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the hover, pressed, and outline states.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Hover & pressed (on) background" },
      { cssVar: "--foreground", utility: "text-foreground", affects: "Hover text" },
      { cssVar: "--input", utility: "border-input", affects: "Outline variant border" },
      {
        cssVar: "--destructive",
        utility: "border-destructive",
        affects: "aria-invalid border & ring",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "default / lg corner radius", radius: true },
      { cssVar: "--radius-md", utility: "rounded-[min(--radius-md,…)]", affects: "sm size corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Toggle's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Toggle. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
