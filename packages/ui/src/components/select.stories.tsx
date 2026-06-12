import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Displays a list of options for the user to pick from—triggered by a button.",
      },
    },
  },
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time</SelectItem>
          <SelectItem value="cst">Central Standard Time</SelectItem>
          <SelectItem value="pst">Pacific Standard Time</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
          <SelectItem value="cet">Central European Time</SelectItem>
          <SelectItem value="eet">Eastern European Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithDisabledItems: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="team" disabled>
          Team (coming soon)
        </SelectItem>
        <SelectItem value="enterprise">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const SmallSize: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="sm" className="w-[180px]">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
        <SelectItem value="two">Two</SelectItem>
        <SelectItem value="three">Three</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Trigger colors",
    description: "Semantic tokens used by the trigger button across its states.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Trigger border & background tint (dark mode)" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Placeholder text & chevron icon" },
      { cssVar: "--destructive", utility: "ring-destructive", affects: "aria-invalid border & ring" },
    ],
  },
  {
    title: "Surface colors",
    description: "Semantic tokens used by the dropdown popup, items, and separator.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Dropdown surface & scroll buttons",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Dropdown text",
        },
      },
      {
        cssVar: "--accent",
        utility: "bg-accent",
        affects: "Highlighted (focused) item background",
        foreground: {
          cssVar: "--accent-foreground",
          utility: "text-accent-foreground",
          affects: "Highlighted item text",
        },
      },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Group label text" },
      { cssVar: "--border", utility: "bg-border", affects: "Separator line" },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Surface edge ring (1px, 10% opacity)" },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Trigger focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Trigger (default) & surface corner radius", radius: true },
      { cssVar: "--radius-md", utility: "rounded-[min(--radius-md,…)]", affects: "Trigger corner radius at the sm size", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Select's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Select. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
