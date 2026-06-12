import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Beautiful charts. Built using Recharts. Copy and paste into your apps.",
      },
    },
  },
  title: "Components/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof ChartContainer>

export const Default: Story = {
  render: () => (
    <div className="h-[300px] w-[500px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
}

export const StackedBar: Story = {
  render: () => (
    <div className="h-[300px] w-[500px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="var(--color-desktop)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="mobile"
            stackId="a"
            fill="var(--color-mobile)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  ),
}

export const LineVariant: Story = {
  render: () => (
    <div className="h-[300px] w-[500px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="desktop"
            type="monotone"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="mobile"
            type="monotone"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Series ramp",
    description:
      "The teal/cyan chart ramp — each series color. The ramp differs per theme so every series stays visible on its background.",
    tokens: [
      { cssVar: "--chart-1", utility: "fill-chart-1 / stroke-chart-1", affects: "Data series 1" },
      { cssVar: "--chart-2", utility: "fill-chart-2 / stroke-chart-2", affects: "Data series 2" },
      { cssVar: "--chart-3", utility: "fill-chart-3 / stroke-chart-3", affects: "Data series 3" },
      { cssVar: "--chart-4", utility: "fill-chart-4 / stroke-chart-4", affects: "Data series 4" },
      { cssVar: "--chart-5", utility: "fill-chart-5 / stroke-chart-5", affects: "Data series 5" },
    ],
  },
  {
    title: "Chrome colors",
    description: "Tokens used by the grid, axes, tooltip, and legend.",
    tokens: [
      {
        cssVar: "--background",
        utility: "bg-background",
        affects: "Tooltip background",
        foreground: {
          cssVar: "--foreground",
          utility: "text-foreground",
          affects: "Tooltip value text",
        },
      },
      { cssVar: "--border", utility: "stroke-border / border-border/50", affects: "Grid lines, cursor, tooltip border" },
      { cssVar: "--muted", utility: "fill-muted / bg-muted", affects: "Tooltip/bar cursor & radial background fill" },
      {
        cssVar: "--muted-foreground",
        utility: "fill-muted-foreground / text-muted-foreground",
        affects: "Axis tick labels, legend & series labels",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Tooltip corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Chart's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Chart. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
