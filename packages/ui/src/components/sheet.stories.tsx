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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Button } from "@workspace/ui/components/button"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A panel that slides in from an edge of the screen, built on the Dialog primitive. Sheet is the desktop-oriented counterpart to Drawer — which is touch- and drag-driven via vaul. Reach for Sheet for side panels (navigation, filters, detail or edit forms), and pair it with Drawer so the same surface becomes a bottom sheet on mobile (see the Responsive story).",
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

/**
 * The canonical Sheet + Drawer pairing. The same content is rendered in a Sheet
 * on desktop and a Drawer (vaul, drag-to-dismiss) on viewports below 768px,
 * switched at runtime by the `useIsMobile` hook.
 */
function ResponsivePanel() {
  const isMobile = useIsMobile()

  const body = (
    <div className="grid gap-2 px-4">
      <label htmlFor="responsive-label" className="text-sm font-medium">
        Display label
      </label>
      <input
        id="responsive-label"
        defaultValue="Core-A"
        className="h-9 rounded-md border bg-input/30 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Edit settings</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit settings</DrawerTitle>
            <DrawerDescription>
              Make changes to the reactor settings here.
            </DrawerDescription>
          </DrawerHeader>
          {body}
          <DrawerFooter>
            <Button>Save changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit settings</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit settings</SheetTitle>
          <SheetDescription>
            Make changes to the reactor settings here.
          </SheetDescription>
        </SheetHeader>
        {body}
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Sheet on desktop, Drawer on mobile, switched by the `useIsMobile` hook (768px breakpoint). The same content fills whichever shell is active. Resize the preview — or use Storybook's viewport toolbar — to cross the breakpoint and watch the side sheet become a draggable bottom drawer.",
      },
    },
  },
  render: () => <ResponsivePanel />,
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Panel surface and the edge border between the sheet and the page.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Sheet panel background",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Sheet panel text",
        },
      },
      { cssVar: "--border", utility: "border-s / border-e", affects: "Panel edge border (per side)" },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Sheet's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Sheet. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
