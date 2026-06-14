import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@workspace/ui/components/checkbox"
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
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked" defaultChecked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="indeterminate" indeterminate />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
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

export const WithLabel: Story = {
  render: () => (
    <Label htmlFor="newsletter">
      <Checkbox id="newsletter" defaultChecked />
      Subscribe to the newsletter
    </Label>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the checkbox's unchecked, checked, and invalid states.",
    tokens: [
      {
        cssVar: "--primary",
        utility: "bg-primary",
        affects: "Checked background & border",
        foreground: {
          cssVar: "--primary-foreground",
          utility: "text-primary-foreground",
          affects: "Checkmark color when checked",
        },
      },
      { cssVar: "--input", utility: "border-input", affects: "Unchecked border (and dark-mode fill tint)" },
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
 * Checkbox's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Checkbox. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
