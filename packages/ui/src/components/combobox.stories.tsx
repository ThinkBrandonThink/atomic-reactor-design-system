import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@workspace/ui/components/combobox"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro", "Gatsby"]

const fruitGroups = [
  { value: "Citrus", items: ["Orange", "Lemon", "Lime", "Grapefruit"] },
  {
    value: "Berries",
    items: ["Strawberry", "Blueberry", "Raspberry", "Blackberry"],
  },
  { value: "Tropical", items: ["Mango", "Pineapple", "Papaya", "Banana"] },
]

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Autocomplete input with a list of suggestions.",
      },
    },
  },
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxInput
        placeholder="Select a framework..."
        className="w-[260px]"
      />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(framework: string) => (
            <ComboboxItem key={framework} value={framework}>
              {framework}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Combobox items={fruitGroups}>
      <ComboboxInput placeholder="Search fruits..." className="w-[260px]" />
      <ComboboxContent>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>
          {(group: { value: string; items: string[] }) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(fruit: string) => (
                  <ComboboxItem key={fruit} value={fruit}>
                    {fruit}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Popup colors",
    description: "Tokens for the dropdown surface, items, and group labels.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Dropdown content background",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Dropdown content text",
        },
      },
      {
        cssVar: "--accent",
        utility: "bg-accent",
        affects: "Highlighted item background",
        foreground: {
          cssVar: "--accent-foreground",
          utility: "text-accent-foreground",
          affects: "Highlighted item text",
        },
      },
      { cssVar: "--foreground", utility: "ring-foreground/10 · text-foreground", affects: "Popup hairline ring & chip text" },
      { cssVar: "--muted", utility: "bg-muted", affects: "Selected chip background" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Group label & trigger icon" },
      { cssVar: "--border", utility: "bg-border", affects: "Separator line" },
    ],
  },
  {
    title: "Input colors",
    description: "Tokens for the input field and the chips container.",
    tokens: [
      { cssVar: "--input", utility: "border-input", affects: "Input & chips border" },
      { cssVar: "--input-fill", utility: "bg-input-fill/30", affects: "Inline search input fill inside the popup" },
      { cssVar: "--destructive", utility: "border-destructive", affects: "aria-invalid border & ring" },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-within border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Dropdown content & chips corner radius", radius: true },
      { cssVar: "--radius-md", utility: "rounded-md", affects: "Item corner radius", radius: true },
      { cssVar: "--radius-sm", utility: "rounded-sm", affects: "Chip corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Combobox's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Combobox. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
