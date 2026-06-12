import type { Meta, StoryObj } from "@storybook/react-vite"
import { CreditCardIcon, MailIcon, SearchIcon, SendIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Add addons, buttons, and helper content to inputs.",
      },
    },
  },
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup className="w-[320px]">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}

export const WithTextPrefix: Story = {
  render: () => (
    <InputGroup className="w-[320px]">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}

export const WithTrailingIcon: Story = {
  render: () => (
    <InputGroup className="w-[320px]">
      <InputGroupInput type="email" placeholder="you@example.com" />
      <InputGroupAddon align="inline-end">
        <MailIcon />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-[320px]">
      <InputGroupAddon>
        <CreditCardIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" size="icon-xs">
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithTextarea: Story = {
  render: () => (
    <InputGroup className="w-[320px]">
      <InputGroupTextarea placeholder="Write a message..." rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupText>0 / 280</InputGroupText>
        <InputGroupButton variant="default" size="xs" className="ms-auto">
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the group border, fill, validation, and addon text.",
    tokens: [
      { cssVar: "--input", utility: "border-input / bg-input", affects: "Group border & fill (dark mode)" },
      { cssVar: "--destructive", utility: "border-destructive", affects: "aria-invalid border & ring" },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Addon & text label color",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-within border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Group corner radius", radius: true },
      {
        cssVar: "--radius",
        utility: "rounded-[calc(var(--radius)-3px)]",
        affects: "Base radius — addon button & kbd corners derive from it",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * InputGroup's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the InputGroup. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
