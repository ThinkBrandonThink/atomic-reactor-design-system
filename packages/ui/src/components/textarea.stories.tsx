import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form textarea or a component that looks like a textarea.",
      },
    },
  },
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Type your message here...",
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" placeholder="Leave a comment..." />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} disabled placeholder="Disabled" />
    </div>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} aria-invalid placeholder="Invalid value" />
    </div>
  ),
}

export const WithValue: Story = {
  render: (args) => (
    <div className="w-80">
      <Textarea
        {...args}
        defaultValue="The atomic reactor design system keeps every form control visually consistent."
      />
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens that color the field, placeholder, and validation states.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Border · disabled & dark background tint" },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Placeholder text",
      },
      {
        cssVar: "--destructive",
        utility: "border-destructive",
        affects: "aria-invalid border & ring",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Field corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Textarea's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Textarea. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
