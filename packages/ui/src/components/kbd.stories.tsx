import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import { CommandIcon } from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Used to display textual user input from keyboard.",
      },
    },
  },
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: { children: "K" },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Keys: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>
        <CommandIcon />
      </Kbd>
    </div>
  ),
}

export const Combination: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>
        <CommandIcon />
      </Kbd>
      <span className="text-xs text-muted-foreground">+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}
