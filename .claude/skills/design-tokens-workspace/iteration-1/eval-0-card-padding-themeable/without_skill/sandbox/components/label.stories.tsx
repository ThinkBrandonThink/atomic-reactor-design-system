import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Renders an accessible label associated with controls.",
      },
    },
  },
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    htmlFor: { control: "text" },
  },
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} htmlFor="username">
        Username
      </Label>
      <Input id="username" placeholder="atomic-reactor" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <Label htmlFor="terms">
      <Checkbox id="terms" />
      Accept terms and conditions
    </Label>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="group flex flex-col gap-2" data-disabled={true}>
      <Label htmlFor="disabled-input">Disabled field</Label>
      <Input id="disabled-input" disabled placeholder="Disabled" />
    </div>
  ),
}
