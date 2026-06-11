import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown, Copy, Redo, Undo } from "lucide-react"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A container that groups related buttons together with consistent styling.",
      },
    },
  },
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <Undo />
        Undo
      </Button>
      <Button variant="outline">
        <Redo />
        Redo
      </Button>
      <Button variant="outline">
        <Copy />
        Copy
      </Button>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">atomicjolt.com</Button>
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  ),
}

export const Nested: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Paste</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Cut</Button>
        <Button variant="outline">Delete</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}
