import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bold, Italic, Underline } from "lucide-react"
import { Toggle } from "@workspace/ui/components/toggle"

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
