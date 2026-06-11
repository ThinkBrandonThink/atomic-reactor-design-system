import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "A carousel with motion and swipe built using Embla.",
      },
    },
  },
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

const Slide = ({ n }: { n: number }) => (
  <div className="flex aspect-square items-center justify-center rounded-lg bg-muted p-6">
    <span className="text-4xl font-semibold">{n}</span>
  </div>
)

export const Default: Story = {
  render: (args) => (
    <div className="w-[300px]">
      <Carousel {...args} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <Slide n={i + 1} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const MultipleSlides: Story = {
  render: () => (
    <div className="w-[420px]">
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <Slide n={i + 1} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="py-12">
      <Carousel
        orientation="vertical"
        opts={{ align: "start" }}
        className="w-[260px]"
      >
        <CarouselContent className="h-[300px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i} className="basis-1/2">
              <Slide n={i + 1} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}
