import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@workspace/ui/components/separator"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: { component: "Visually or semantically separates content." },
    },
  },
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <p className="text-sm font-medium">Reactor Core</p>
      <p className="text-sm text-muted-foreground">Primary control unit.</p>
      <Separator {...args} className="my-4" />
      <p className="text-sm text-muted-foreground">Status: nominal</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4 text-sm">
      <span>Overview</span>
      <Separator orientation="vertical" />
      <span>Logs</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "The line color shared by both orientations.",
    tokens: [
      { cssVar: "--border", utility: "bg-border", affects: "Separator line color" },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Separator's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Separator. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
