import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarDays } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "For sighted users to preview content available behind a link.",
      },
    },
  },
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link">@nextjs</Button>} />
      <HoverCardContent>
        <div className="flex justify-between gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            N
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm text-muted-foreground">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const TextPreview: Story = {
  render: () => (
    <p className="max-w-sm text-sm">
      Built with{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <a
              href="#"
              className="font-medium text-primary underline underline-offset-4"
            >
              Base UI
            </a>
          }
        />
        <HoverCardContent>
          <h4 className="text-sm font-semibold">Base UI</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Unstyled, accessible React components for building high-quality
            design systems and web apps.
          </p>
        </HoverCardContent>
      </HoverCard>{" "}
      primitives.
    </p>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface colors",
    description: "Semantic tokens used by the hover-card popup surface.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Popup surface",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Popup text",
        },
      },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Popup hairline ring" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Popup corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * HoverCard's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the HoverCard. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
