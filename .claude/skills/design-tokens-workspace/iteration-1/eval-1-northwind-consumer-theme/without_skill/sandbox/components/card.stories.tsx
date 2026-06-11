import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { EllipsisIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays a card with header, content, and footer.",
      },
    },
  },
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
  args: { size: "default" },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Reactor status</CardTitle>
        <CardDescription>Core temperature nominal.</CardDescription>
      </CardHeader>
      <CardContent>
        All subsystems are operating within expected parameters.
      </CardContent>
    </Card>
  ),
}

export const Full: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Deploy reactor</CardTitle>
        <CardDescription>
          Push the current configuration to production.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="More options">
            <EllipsisIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        This will roll out the new control parameters to all active cores.
        Existing sessions remain unaffected.
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Deploy</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Card size="default" className="w-72">
        <CardHeader>
          <CardTitle>Default size</CardTitle>
          <CardDescription>Standard card spacing.</CardDescription>
        </CardHeader>
        <CardContent>Comfortable padding for most layouts.</CardContent>
      </Card>
      <Card size="sm" className="w-72">
        <CardHeader>
          <CardTitle>Small size</CardTitle>
          <CardDescription>Condensed card spacing.</CardDescription>
        </CardHeader>
        <CardContent>Tighter padding for dense layouts.</CardContent>
      </Card>
    </div>
  ),
}
