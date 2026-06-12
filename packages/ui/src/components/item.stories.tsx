import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon, FileTextIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Button } from "@workspace/ui/components/button"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A versatile component for displaying content with media, title, description, and actions.",
      },
    },
  },
  title: "Components/Item",
  component: Item,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "outline", "muted"],
    },
    size: {
      control: { type: "radio" },
      options: ["default", "sm", "xs"],
    },
  },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Item {...args} className="w-[420px]">
      <ItemMedia variant="icon">
        <FileTextIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Project proposal</ItemTitle>
        <ItemDescription>Updated 2 days ago by Jordan</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm">
          <ChevronRightIcon />
        </Button>
      </ItemActions>
    </Item>
  ),
  args: { variant: "outline" },
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemMedia variant="icon">
            <FileTextIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="capitalize">{variant}</ItemTitle>
            <ItemDescription>The {variant} item variant.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <ItemGroup className="w-[420px]">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Inbox</ItemTitle>
          <ItemDescription>12 unread messages</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Drafts</ItemTitle>
          <ItemDescription>3 saved drafts</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Archive</ItemTitle>
          <ItemDescription>148 archived items</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the outline / muted variants, hover, and content.",
    tokens: [
      { cssVar: "--border", utility: "border-border", affects: "Outline variant border" },
      { cssVar: "--muted", utility: "bg-muted", affects: "Muted variant background & link/anchor hover background" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "ItemDescription text" },
      { cssVar: "--primary-link", utility: "text-primary-link", affects: "Hovered link inside ItemDescription" },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Item corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-sm",
        utility: "rounded-sm",
        affects: "ItemMedia image corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Item's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Item. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
