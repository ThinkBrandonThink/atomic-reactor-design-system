import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Use to show a placeholder while content is loading.",
      },
    },
  },
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
}

export const Card: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10">
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
}

export const ProfilePlaceholder: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "The pulsing placeholder fill.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Skeleton placeholder fill" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-md", utility: "rounded-md", affects: "Skeleton corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Skeleton's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Skeleton. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
