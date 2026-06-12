import type { Meta, StoryObj } from "@storybook/react-vite"
import { Settings2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays rich content in a portal, triggered by a button.",
      },
    },
  },
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Open popover</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>About this project</PopoverTitle>
          <PopoverDescription>
            A popover floats above the page and is anchored to its trigger.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <Settings2 />
            Dimensions
          </Button>
        }
      />
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2.5">
          <div className="grid grid-cols-3 items-center gap-3">
            <label htmlFor="width" className="text-sm">
              Width
            </label>
            <input
              id="width"
              defaultValue="100%"
              className="col-span-2 h-8 rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <label htmlFor="height" className="text-sm">
              Height
            </label>
            <input
              id="height"
              defaultValue="25px"
              className="col-span-2 h-8 rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the popover surface and its text.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Popover surface background",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Popover body text",
        },
      },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Description text",
      },
      {
        cssVar: "--foreground",
        utility: "ring-foreground/10",
        affects: "Surface edge ring (1px, 10% opacity)",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Popover surface corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Popover's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Popover. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
