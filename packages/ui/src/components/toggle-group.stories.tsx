import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "A set of two-state buttons that can be toggled on or off.",
      },
    },
  },
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: { type: "number" } },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args} defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <ToggleGroup {...args} defaultValue={["left"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Joined: Story = {
  args: { variant: "outline", spacing: 0 },
  render: (args) => (
    <ToggleGroup {...args} defaultValue={["center"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup key={size} variant="outline" size={size} spacing={0}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ToggleGroup variant="outline" orientation="vertical" spacing={0}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description:
      "Semantic tokens used by the items (shared toggleVariants) — hover, pressed, and outline states.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Item hover & pressed (on) background" },
      { cssVar: "--foreground", utility: "text-foreground", affects: "Item hover text" },
      { cssVar: "--input", utility: "border-input", affects: "Outline variant item border" },
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
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Group corner radius", radius: true },
      {
        cssVar: "--radius-md",
        utility: "rounded-[min(--radius-md,…)]",
        affects: "sm-size group corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * ToggleGroup's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the ToggleGroup. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
