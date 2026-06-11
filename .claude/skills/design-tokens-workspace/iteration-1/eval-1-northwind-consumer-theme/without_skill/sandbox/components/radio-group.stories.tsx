import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.",
      },
    },
  },
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    defaultValue: "comfortable",
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Label htmlFor="r-default">
        <RadioGroupItem value="default" id="r-default" />
        Default
      </Label>
      <Label htmlFor="r-comfortable">
        <RadioGroupItem value="comfortable" id="r-comfortable" />
        Comfortable
      </Label>
      <Label htmlFor="r-compact">
        <RadioGroupItem value="compact" id="r-compact" />
        Compact
      </Label>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <RadioGroup {...args}>
      <Label htmlFor="d-one">
        <RadioGroupItem value="one" id="d-one" />
        Option one
      </Label>
      <Label htmlFor="d-two">
        <RadioGroupItem value="two" id="d-two" />
        Option two
      </Label>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="">
      <Label htmlFor="i-yes">
        <RadioGroupItem value="yes" id="i-yes" aria-invalid />
        Yes
      </Label>
      <Label htmlFor="i-no">
        <RadioGroupItem value="no" id="i-no" aria-invalid />
        No
      </Label>
    </RadioGroup>
  ),
}

export const PlanSelection: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" className="w-72">
      <Label htmlFor="p-free">
        <RadioGroupItem value="free" id="p-free" />
        Free
      </Label>
      <Label htmlFor="p-pro">
        <RadioGroupItem value="pro" id="p-pro" />
        Pro
      </Label>
      <Label htmlFor="p-enterprise">
        <RadioGroupItem value="enterprise" id="p-enterprise" />
        Enterprise
      </Label>
    </RadioGroup>
  ),
}
