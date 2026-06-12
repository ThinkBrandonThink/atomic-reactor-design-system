import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.",
      },
    },
  },
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactor status</DialogTitle>
          <DialogDescription>
            The core is operating within nominal parameters. Review the readings
            before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Acknowledge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button>Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit operator profile</DialogTitle>
          <DialogDescription>
            Update your operator details. Changes are applied immediately.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              defaultValue="Marie Curie"
              className="h-9 rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="clearance" className="text-sm font-medium">
              Clearance level
            </label>
            <input
              id="clearance"
              defaultValue="Level 5"
              className="h-9 rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const ScrollableContent: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline">Terms of use</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Operating agreement</DialogTitle>
          <DialogDescription>
            Please review the full agreement before accepting.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-72 space-y-3 overflow-y-auto pe-2 text-sm text-muted-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i}>
              Section {i + 1}. The operator agrees to follow all containment
              protocols, log every shift, and report anomalies to the duty
              supervisor without delay.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Decline</Button>} />
          <DialogClose render={<Button>Accept</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithoutCloseButton: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No corner close</DialogTitle>
          <DialogDescription>
            This dialog hides the corner close button and relies on the footer
            action instead.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface colors",
    description: "Semantic tokens used by the dialog overlay, content surface, and footer.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Dialog content surface",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Dialog content text",
        },
      },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Content hairline ring" },
      { cssVar: "--muted", utility: "bg-muted/50", affects: "Footer background tint" },
      { cssVar: "--border", utility: "border-t", affects: "Footer top border" },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Description text",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-xl",
        utility: "rounded-xl",
        affects: "Dialog content corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Dialog's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Dialog. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
