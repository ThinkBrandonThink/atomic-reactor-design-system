import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@workspace/ui/components/calendar"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the grid surface, selected days, range fill, and muted text.",
    tokens: [
      { cssVar: "--background", utility: "bg-background", affects: "Calendar surface background" },
      {
        cssVar: "--primary",
        utility: "bg-primary",
        affects: "Selected day & range endpoint fill",
        foreground: {
          cssVar: "--primary-foreground",
          utility: "text-primary-foreground",
          affects: "Selected day & range endpoint text",
        },
      },
      {
        cssVar: "--muted",
        utility: "bg-muted",
        affects: "Range middle, today, and nav-button hover fill",
        foreground: {
          cssVar: "--foreground",
          utility: "text-foreground",
          affects: "Range middle & today text",
        },
      },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Weekday/week-number labels, outside & disabled days" },
      { cssVar: "--popover", utility: "bg-popover", affects: "Native dropdown (month/year) background" },
    ],
  },
  {
    title: "Focus",
    description: "Focus-visible outline on a day button.",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focused day border & ring" }],
  },
  {
    title: "Radius",
    description: "--cell-radius drives day/cell corners and defaults to --radius-md.",
    tokens: [
      { cssVar: "--radius-md", utility: "rounded-(--cell-radius)", affects: "Day cell, range endpoint, and dropdown corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Calendar's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Calendar. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
