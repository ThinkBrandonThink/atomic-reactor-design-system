import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Toaster } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"

const meta = {
  parameters: {
    docs: {
      description: { component: "An opinionated toast component for React." },
    },
  },
  title: "Components/Sonner",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Show toast
      </Button>
    </>
  ),
}

export const Types: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Event has been created", {
              description: "Sunday, December 3rd at 9:00 AM",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Be careful with this action")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Your trial ends in 3 days")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong")}
        >
          Error
        </Button>
      </div>
    </>
  ),
}

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            action: {
              label: "Undo",
              onClick: () => toast("Undone"),
            },
          })
        }
      >
        Show toast with action
      </Button>
    </>
  ),
}

export const PromiseToast: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Loading...",
              success: "Data loaded successfully",
              error: "Failed to load data",
            }
          )
        }
      >
        Show promise toast
      </Button>
    </>
  ),
}
