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
