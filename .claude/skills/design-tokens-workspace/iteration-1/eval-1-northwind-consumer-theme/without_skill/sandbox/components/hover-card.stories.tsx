import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarDays } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"

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
