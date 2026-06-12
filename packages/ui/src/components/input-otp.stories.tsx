import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Accessible one-time password component with copy-paste functionality.",
      },
    },
  },
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  argTypes: {
    maxLength: {
      control: { type: "number" },
      description: "The maximum number of characters/slots.",
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof InputOTP>

export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="space-y-2">
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-sm text-muted-foreground">
          {value === "" ? "Enter your one-time password." : `Value: ${value}`}
        </p>
      </div>
    )
  },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the slots and active/invalid states.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Slot border (and slot fill in dark mode)" },
      { cssVar: "--foreground", utility: "bg-foreground", affects: "Blinking fake caret in the active slot" },
      {
        cssVar: "--destructive",
        utility: "border-destructive",
        affects: "aria-invalid slot border & ring",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Active slot border & ring" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Group & end-slot corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * InputOTP's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the InputOTP. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
