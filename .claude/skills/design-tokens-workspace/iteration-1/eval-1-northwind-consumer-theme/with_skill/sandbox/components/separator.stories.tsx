import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@workspace/ui/components/separator"

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
