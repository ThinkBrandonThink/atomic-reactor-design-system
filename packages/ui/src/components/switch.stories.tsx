import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked.",
      },
    },
  },
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default"] },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} size="sm" defaultChecked />
      <Switch {...args} size="default" defaultChecked />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch {...args} id="off" />
        <Label htmlFor="off">Off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} id="on" defaultChecked />
        <Label htmlFor="on">On</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on">Disabled on</Label>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens that color the track and thumb.",
    tokens: [
      { cssVar: "--primary", utility: "bg-primary", affects: "Checked track background" },
      { cssVar: "--input", utility: "bg-input", affects: "Unchecked track background" },
      { cssVar: "--background", utility: "bg-background", affects: "Thumb fill (light)" },
      { cssVar: "--primary-foreground", utility: "bg-primary-foreground", affects: "Checked thumb fill (dark)" },
      { cssVar: "--foreground", utility: "bg-foreground", affects: "Unchecked thumb fill (dark)" },
      { cssVar: "--destructive", utility: "border-destructive", affects: "aria-invalid border & ring" },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Switch's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Switch. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
