import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@workspace/ui/components/slider"
import { Label } from "@workspace/ui/components/label"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "An input where the user selects a value from within a given range.",
      },
    },
  },
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider {...args} />
    </div>
  ),
}

export const Range: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider {...args} defaultValue={[25, 75]} />
    </div>
  ),
}

export const Steps: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider {...args} step={10} defaultValue={40} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3">
      <Label>Volume</Label>
      <Slider {...args} defaultValue={60} />
    </div>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <div className="h-48">
      <Slider {...args} orientation="vertical" defaultValue={50} />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider {...args} disabled defaultValue={30} />
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Track, filled range, and thumb colors.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Track background (unfilled)" },
      { cssVar: "--primary", utility: "bg-primary", affects: "Filled range (indicator)" },
      { cssVar: "--ring", utility: "border-ring", affects: "Thumb border" },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Thumb hover / focus-visible / active ring" },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Slider's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Slider. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
