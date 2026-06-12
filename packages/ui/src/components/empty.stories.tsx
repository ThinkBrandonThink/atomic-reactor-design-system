import type { Meta, StoryObj } from "@storybook/react-vite"
import { FolderPlusIcon, InboxIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Button } from "@workspace/ui/components/button"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Use the Empty component to display an empty state.",
      },
    },
  },
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="w-[420px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          When you receive messages, they will show up here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Empty className="w-[420px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlusIcon />
        </EmptyMedia>
        <EmptyTitle>No projects</EmptyTitle>
        <EmptyDescription>
          Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create project</Button>
        <Button variant="outline">Import existing</Button>
      </EmptyContent>
    </Empty>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the empty-state icon media and text.",
    tokens: [
      {
        cssVar: "--muted",
        utility: "bg-muted",
        affects: "Icon media background (icon variant)",
        foreground: {
          cssVar: "--foreground",
          utility: "text-foreground",
          affects: "Icon media glyph color",
        },
      },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Description text",
      },
      {
        cssVar: "--primary-link",
        utility: "text-primary-link",
        affects: "Inline link hover color in the description",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-xl",
        utility: "rounded-xl",
        affects: "Empty container corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Icon media corner radius (icon variant)",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Empty's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Empty. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
