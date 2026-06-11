import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Augments native scroll functionality for custom, cross-browser styling.",
      },
    },
  },
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const tags = Array.from({ length: 50 }).map((_, i) => `v1.2.0-beta.${i + 1}`)

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-60 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <div className="my-2 h-px bg-border last:hidden" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const VerticalContent: Story = {
  render: () => (
    <ScrollArea className="h-64 w-[350px] rounded-md border p-4">
      <p className="text-sm leading-relaxed">
        {Array.from({ length: 12 })
          .map(
            () =>
              "The reactor core maintains a stable thermal gradient across all coolant channels. "
          )
          .join("")}
      </p>
    </ScrollArea>
  ),
}

export const HorizontalContent: Story = {
  render: () => (
    <ScrollArea className="w-[400px] rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <figure key={i} className="shrink-0">
            <div className="flex size-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
              Photo {i + 1}
            </div>
          </figure>
        ))}
      </div>
    </ScrollArea>
  ),
}
