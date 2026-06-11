import type { Meta, StoryObj } from "@storybook/react-vite"

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
import { MinusIcon, PlusIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: { description: { component: "A drawer component for React." } },
  },
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Adjust output</DrawerTitle>
          <DrawerDescription>
            Fine-tune the reactor power output for this shift.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center justify-center gap-4 p-4">
          <Button variant="outline" size="icon">
            <MinusIcon />
          </Button>
          <span className="font-heading text-3xl font-medium tabular-nums">
            72%
          </span>
          <Button variant="outline" size="icon">
            <PlusIcon />
          </Button>
        </div>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const FromRight: Story = {
  args: { direction: "right" },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open from right</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Session details</DrawerTitle>
          <DrawerDescription>
            Review the metadata for the current monitoring session.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-2 p-4 text-sm text-muted-foreground">
          <p>Started: 08:14 UTC</p>
          <p>Operator: M. Curie</p>
          <p>Channel: Core-A</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const FromLeft: Story = {
  args: { direction: "left" },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open from left</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Jump to a control panel.</DrawerDescription>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 p-4 text-sm">
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Overview
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Telemetry
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-muted" href="#">
            Alerts
          </a>
        </nav>
      </DrawerContent>
    </Drawer>
  ),
}

export const FromTop: Story = {
  args: { direction: "top" },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open from top</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>System notice</DrawerTitle>
          <DrawerDescription>
            A scheduled maintenance window begins in 30 minutes.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Dismiss</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
