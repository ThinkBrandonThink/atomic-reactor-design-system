import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form textarea or a component that looks like a textarea.",
      },
    },
  },
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Type your message here...",
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" placeholder="Leave a comment..." />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} disabled placeholder="Disabled" />
    </div>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} aria-invalid placeholder="Invalid value" />
    </div>
  ),
}

export const WithValue: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea
        {...args}
        defaultValue="The atomic reactor design system keeps every form control visually consistent."
      />
    </div>
  ),
}
