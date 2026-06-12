import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Toaster } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Toast surface and border, wired into Sonner's --normal-* variables.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "--normal-bg",
        affects: "Toast background",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "--normal-text",
          affects: "Toast text",
        },
      },
      { cssVar: "--border", utility: "--normal-border", affects: "Toast border" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius",
        utility: "--border-radius",
        affects: "Toast corner radius — base radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Toaster's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Toaster. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
