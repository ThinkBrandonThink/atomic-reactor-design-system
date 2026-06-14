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

const allSeriesData = [
  { month: "January", series1: 186, series2: 80, series3: 120, series4: 90, series5: 150 },
  { month: "February", series1: 305, series2: 200, series3: 170, series4: 250, series5: 110 },
  { month: "March", series1: 237, series2: 120, series3: 190, series4: 130, series5: 220 },
  { month: "April", series1: 173, series2: 190, series3: 250, series4: 160, series5: 90 },
  { month: "May", series1: 209, series2: 130, series3: 140, series4: 220, series5: 180 },
  { month: "June", series1: 264, series2: 240, series3: 110, series4: 180, series5: 200 },
]

const allSeriesConfig = {
  series1: { label: "Series 1", color: "var(--chart-1)" },
  series2: { label: "Series 2", color: "var(--chart-2)" },
  series3: { label: "Series 3", color: "var(--chart-3)" },
  series4: { label: "Series 4", color: "var(--chart-4)" },
  series5: { label: "Series 5", color: "var(--chart-5)" },
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

/**
 * Exercises the full chart palette — one line per series, mapped to --chart-1
 * through --chart-5. The legend labels each series so it's distinguishable
 * without relying on color alone (WCAG 1.4.1).
 */
export const AllSeriesColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All five chart colors at once — --chart-1 through --chart-5. Series are told apart by hue plus the legend label.",
      },
    },
  },
  render: () => (
    <div className="h-[300px] w-[500px]">
      <ChartContainer config={allSeriesConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={allSeriesData}
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
          <Line dataKey="series1" type="monotone" stroke="var(--color-series1)" strokeWidth={2} dot={false} />
          <Line dataKey="series2" type="monotone" stroke="var(--color-series2)" strokeWidth={2} dot={false} />
          <Line dataKey="series3" type="monotone" stroke="var(--color-series3)" strokeWidth={2} dot={false} />
          <Line dataKey="series4" type="monotone" stroke="var(--color-series4)" strokeWidth={2} dot={false} />
          <Line dataKey="series5" type="monotone" stroke="var(--color-series5)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Series palette",
    description:
      "The chart palette — one color per data series, five distinct hues (not a brand color). Values differ per theme so every series stays visible on its background; series are told apart by hue plus the legend label.",
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
