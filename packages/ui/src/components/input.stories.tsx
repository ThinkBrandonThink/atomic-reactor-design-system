import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A text input component for forms and user data entry with built-in styling and accessibility features.",
      },
    },
  },
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Types: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3">
      <Input {...args} type="text" placeholder="Text" />
      <Input {...args} type="email" placeholder="Email" />
      <Input {...args} type="password" placeholder="Password" />
      <Input {...args} type="number" placeholder="Number" />
      <Input {...args} type="search" placeholder="Search" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
}

export const Invalid: Story = {
  args: { placeholder: "Invalid value", "aria-invalid": true },
}

export const FileInput: Story = {
  args: { type: "file", placeholder: undefined },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface & text",
    description: "The field border, fill, and text colors.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Border & background (disabled / dark mode)" },
      { cssVar: "--foreground", utility: "text-foreground", affects: "Input & file-button text" },
      { cssVar: "--muted-foreground", utility: "placeholder:text-muted-foreground", affects: "Placeholder text" },
    ],
  },
  {
    title: "State",
    description: "Focus and validation feedback.",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" },
      { cssVar: "--destructive", utility: "border-destructive", affects: "aria-invalid border & ring" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--input-radius",
        utility: "rounded-(--input-radius)",
        affects: "Input corner radius (defaults to --radius-lg)",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Input's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Input. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
