import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown, Copy, Redo, Undo } from "lucide-react"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

export const WithInput: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>$</ButtonGroupText>
      <Input placeholder="Amount" className="w-28" />
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the separator only with `ghost` (or `link`) buttons, like the split button below — they have no fill and no border of their own, so the separator draws the only division. Avoid it elsewhere: `outline` buttons already render a border (it doubles the line), and solid fills (`default`/`secondary`/`destructive`) already separate visually so the separator just competes with the fill.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="ghost">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="ghost" size="icon">
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

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the text addon and separator (segment buttons carry their own Button tokens).",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "ButtonGroupText addon background" },
      { cssVar: "--border", utility: "bg-border", affects: "Separator color (default)" },
      { cssVar: "--input", utility: "border-input", affects: "Segment borders & separator when the group wraps an input" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Outer corner radius of the grouped segments", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * ButtonGroup's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the ButtonGroup. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
