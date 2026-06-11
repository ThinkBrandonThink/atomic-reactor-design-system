import type { Meta, StoryObj } from "@storybook/react-vite"
import { Callout } from "@workspace/ui/components/callout"
import { AlertTriangleIcon, InfoIcon, XCircleIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "A compact inline callout for drawing attention to a message.",
      },
    },
  },
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "destructive"],
    },
  },
  args: { variant: "info" },
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Callout {...args} className="max-w-md">
      <InfoIcon />
      The reactor will enter scheduled maintenance at 02:00 UTC.
    </Callout>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Callout variant="info">
        <InfoIcon />
        The new control parameters are now live across all cores.
      </Callout>
      <Callout variant="warning">
        <AlertTriangleIcon />
        Coolant pressure is approaching the recommended threshold.
      </Callout>
      <Callout variant="destructive">
        <XCircleIcon />
        Core temperature exceeded the safe limit. Investigate immediately.
      </Callout>
    </div>
  ),
}
