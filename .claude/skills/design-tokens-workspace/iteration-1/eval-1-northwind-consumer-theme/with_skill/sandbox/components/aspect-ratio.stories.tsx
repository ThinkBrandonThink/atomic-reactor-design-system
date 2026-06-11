import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"

const meta = {
  parameters: {
    docs: {
      description: { component: "Displays content within a desired ratio." },
    },
  },
  title: "Components/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "number", step: 0.01 } },
  },
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <AspectRatio
        {...args}
        className="flex items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground"
      >
        {args.ratio.toFixed(2)} : 1
      </AspectRatio>
    </div>
  ),
}

export const WithImage: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <AspectRatio {...args} className="overflow-hidden rounded-lg bg-muted">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
          alt="Landscape"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Ratios: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {[
        { ratio: 1, label: "1:1" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 16 / 9, label: "16:9" },
        { ratio: 21 / 9, label: "21:9" },
      ].map(({ ratio, label }) => (
        <div key={label} className="w-[280px]">
          <AspectRatio
            ratio={ratio}
            className="flex items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground"
          >
            {label}
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}
