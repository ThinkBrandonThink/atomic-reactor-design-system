import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { format } from "date-fns"

import { DatePicker } from "@workspace/ui/components/date-picker"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A date picker pairs a typed-date `Input` with a `Calendar` in a `Popover`. Type a date in the input's format (it parses on blur/Enter and flags an invalid entry) or pick one from the calendar.",
      },
    },
  },
  title: "Components/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    formatStr: { control: "text" },
    disabled: { control: "boolean" },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
    },
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(),
  },
}

/**
 * `formatStr` drives both the displayed value and how typed input is parsed, so
 * the input accepts whatever format you configure.
 */
export const CustomFormat: Story = {
  args: {
    defaultValue: new Date(),
    formatStr: "dd/MM/yyyy",
    placeholder: "DD/MM/YYYY",
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: new Date(),
    disabled: true,
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <div className="flex flex-col gap-2.5">
        <DatePicker {...args} value={date} onValueChange={setDate} />
        <p className="text-body-sm text-muted-foreground">
          Selected: {date ? format(date, "PPP") : "none"}
        </p>
      </div>
    )
  },
}
