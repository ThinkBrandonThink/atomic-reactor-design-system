import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@workspace/ui/components/calendar"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A calendar component that allows users to select a date or a range of dates.",
      },
    },
  },
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    showOutsideDays: { control: "boolean" },
    captionLayout: {
      control: "inline-radio",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    buttonVariant: {
      control: "inline-radio",
      options: ["default", "outline", "ghost", "secondary"],
    },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    )
  },
}

export const Range: Story = {
  render: (args) => {
    const [range, setRange] = React.useState<DateRange | undefined>(() => {
      const from = new Date()
      const to = new Date()
      to.setDate(to.getDate() + 5)
      return { from, to }
    })
    return (
      <Calendar
        {...args}
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border"
      />
    )
  },
}

export const Multiple: Story = {
  render: (args) => {
    const [dates, setDates] = React.useState<Date[] | undefined>([new Date()])
    return (
      <Calendar
        {...args}
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
    )
  },
}

export const WithDropdownNavigation: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        className="rounded-md border"
      />
    )
  },
}
