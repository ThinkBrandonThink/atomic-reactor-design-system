import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@workspace/ui/components/native-select"
import { Label } from "@workspace/ui/components/label"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A styled native HTML select element with consistent design system integration.",
      },
    },
  },
  title: "Components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default"] },
    disabled: { control: "boolean" },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args} defaultValue="next">
      <NativeSelectOption value="next">Next.js</NativeSelectOption>
      <NativeSelectOption value="vite">Vite</NativeSelectOption>
      <NativeSelectOption value="remix">Remix</NativeSelectOption>
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <NativeSelect {...args} size="sm" defaultValue="vite">
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="vite">Vite</NativeSelectOption>
      </NativeSelect>
      <NativeSelect {...args} size="default" defaultValue="vite">
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="vite">Vite</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const WithOptGroups: Story = {
  render: (args) => (
    <NativeSelect {...args} defaultValue="ts">
      <NativeSelectOptGroup label="Compiled">
        <NativeSelectOption value="ts">TypeScript</NativeSelectOption>
        <NativeSelectOption value="rust">Rust</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Interpreted">
        <NativeSelectOption value="py">Python</NativeSelectOption>
        <NativeSelectOption value="rb">Ruby</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="framework">Framework</Label>
      <NativeSelect {...args} id="framework" defaultValue="vite">
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="vite">Vite</NativeSelectOption>
        <NativeSelectOption value="remix">Remix</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <NativeSelect {...args} disabled defaultValue="vite">
      <NativeSelectOption value="vite">Vite</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <NativeSelect {...args} aria-invalid defaultValue="">
      <NativeSelectOption value="">Select a framework</NativeSelectOption>
      <NativeSelectOption value="vite">Vite</NativeSelectOption>
    </NativeSelect>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the select control, its border, and invalid state.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Control border (and fill in dark mode)" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Placeholder text & chevron icon" },
      {
        cssVar: "--primary",
        utility: "selection:bg-primary",
        affects: "Text selection background",
        foreground: {
          cssVar: "--primary-foreground",
          utility: "selection:text-primary-foreground",
          affects: "Text selection text",
        },
      },
      {
        cssVar: "--destructive",
        utility: "border-destructive",
        affects: "aria-invalid border & ring",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Default size corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-md",
        utility: "rounded-[min(--radius-md,…)]",
        affects: "Small size corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * NativeSelect's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the NativeSelect. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
