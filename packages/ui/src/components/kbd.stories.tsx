import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import { CommandIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the key cap and the tooltip-context inversion.",
    tokens: [
      {
        cssVar: "--muted",
        utility: "bg-muted",
        affects: "Key cap background",
        foreground: {
          cssVar: "--muted-foreground",
          utility: "text-muted-foreground",
          affects: "Key cap text",
        },
      },
      {
        cssVar: "--background",
        utility: "bg-background/20",
        affects: "Key cap background & text when inside a tooltip (inverted)",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-sm",
        utility: "rounded-sm",
        affects: "Key cap corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Kbd's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Kbd. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
