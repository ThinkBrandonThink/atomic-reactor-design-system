import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Extends the Dialog component to display content that complements the main content of the screen.",
      },
    },
  },
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit settings</SheetTitle>
          <SheetDescription>
            Make changes to the reactor settings here. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <label htmlFor="label" className="text-sm font-medium">
              Display label
            </label>
            <input
              id="label"
              defaultValue="Core-A"
              className="h-9 rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="threshold" className="text-sm font-medium">
              Alert threshold
            </label>
            <input
              id="threshold"
              defaultValue="85%"
              className="h-9 rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger
        render={<Button variant="outline">Open from left</Button>}
      />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Choose a destination.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 text-sm">
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Dashboard
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Reactors
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Reports
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

export const Top: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline">Open from top</Button>} />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Quick search</SheetTitle>
          <SheetDescription>Search across all reactors.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <input
            placeholder="Type to search…"
            className="h-9 w-full rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger
        render={<Button variant="outline">Open from bottom</Button>}
      />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Share session</SheetTitle>
          <SheetDescription>
            Anyone with the link can view this session.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Copy link</Button>
          <SheetClose render={<Button variant="outline">Done</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
