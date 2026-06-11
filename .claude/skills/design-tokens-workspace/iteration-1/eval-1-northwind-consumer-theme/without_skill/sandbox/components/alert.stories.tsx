import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: { component: "Displays a callout for user attention." },
    },
  },
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
  args: { variant: "default" },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        The reactor will enter scheduled maintenance at 02:00 UTC.
      </AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Alert variant="default">
        <CheckCircle2Icon />
        <AlertTitle>Deployment successful</AlertTitle>
        <AlertDescription>
          The new control parameters are now live across all cores.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Coolant pressure low</AlertTitle>
        <AlertDescription>
          Pressure has dropped below the safe threshold. Investigate
          immediately.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new firmware version is ready to install.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          Install
        </Button>
      </AlertAction>
    </Alert>
  ),
}
