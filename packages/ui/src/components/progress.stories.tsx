import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@workspace/ui/components/progress"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
      },
    },
  },
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  args: { value: 60 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
}

export const Values: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="w-80">
      <Progress {...args}>
        <ProgressLabel>Uploading core image</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the track, indicator, and value label.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Track (unfilled) background" },
      { cssVar: "--primary-on-muted", utility: "bg-primary-on-muted", affects: "Indicator (filled) bar" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Value label text" },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Progress's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Progress. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
