import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@workspace/ui/components/badge"
import { CheckIcon, XIcon } from "lucide-react"

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
        "premium",
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
      <Badge {...args} variant="premium">
        Premium
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
