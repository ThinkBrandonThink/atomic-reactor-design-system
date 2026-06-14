import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple items to be open at the same time.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the whole accordion.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings that each reveal a section of content.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="w-[24rem]">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          What is the Atomic Reactor design system?
        </AccordionTrigger>
        <AccordionContent>
          <p>
            A Base UI + Tailwind v4 component library with a yellow brand
            color and a multi-hue, accessible chart palette.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          <p>
            Yes. It is built on Base UI primitives that ship WAI-ARIA compliant
            keyboard interactions out of the box.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I open more than one item?</AccordionTrigger>
        <AccordionContent>
          <p>
            Toggle the <a href="#">multiple</a> prop to allow several panels to
            stay expanded together.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const OpenMultiple: Story = {
  args: { multiple: true },
  render: Default.render,
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the trigger, item divider, and panel content.",
    tokens: [
      { cssVar: "--border", utility: "border-b", affects: "Item divider between accordion items" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Trigger chevron icon color" },
      { cssVar: "--foreground", utility: "hover:text-foreground", affects: "Panel link hover color" },
    ],
  },
  {
    title: "Focus",
    description: "Focus-visible outline on the trigger.",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Trigger focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Trigger corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Accordion's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Accordion. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
