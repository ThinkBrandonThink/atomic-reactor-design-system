import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible"
import { Button } from "@workspace/ui/components/button"
import { ChevronsUpDownIcon } from "lucide-react"

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Prevent the collapsible from opening or closing.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "An interactive component which expands/collapses a panel.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="flex w-[24rem] flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-medium">@workspace/ui starred repos</h4>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <ChevronsUpDownIcon />
              <span className="sr-only">Toggle</span>
            </Button>
          }
        />
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        @workspace/ui
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @base-ui/react
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          tailwindcss
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
  render: Default.render,
}
