import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@workspace/ui/components/slider"
import { Label } from "@workspace/ui/components/label"

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
