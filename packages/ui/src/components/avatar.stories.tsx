import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@workspace/ui/components/avatar"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "An image element with a fallback for representing the user.",
      },
    },
  },
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "sm", "lg"] },
  },
  args: { size: "default" },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://i.pravatar.cc/120?img=12" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://i.pravatar.cc/120?img=5" alt="Small" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://i.pravatar.cc/120?img=8" alt="Default" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://i.pravatar.cc/120?img=15" alt="Large" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://broken.example/none.png" alt="Broken" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>RX</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src="https://i.pravatar.cc/120?img=20" alt="Online user" />
      <AvatarFallback>ON</AvatarFallback>
      <AvatarBadge className="bg-chart-1" />
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/120?img=1" alt="User one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/120?img=2" alt="User two" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/120?img=3" alt="User three" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the fallback, group count, badge, and avatar ring.",
    tokens: [
      {
        cssVar: "--muted",
        utility: "bg-muted",
        affects: "Fallback & group-count background",
        foreground: {
          cssVar: "--muted-foreground",
          utility: "text-muted-foreground",
          affects: "Fallback & group-count text",
        },
      },
      {
        cssVar: "--primary",
        utility: "bg-primary",
        affects: "Avatar badge background",
        foreground: {
          cssVar: "--primary-foreground",
          utility: "text-primary-foreground",
          affects: "Avatar badge icon/text",
        },
      },
      { cssVar: "--border", utility: "border-border", affects: "Avatar inner edge ring" },
      { cssVar: "--background", utility: "ring-background", affects: "Badge & group ring (separates overlapping avatars)" },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Avatar's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Avatar. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
