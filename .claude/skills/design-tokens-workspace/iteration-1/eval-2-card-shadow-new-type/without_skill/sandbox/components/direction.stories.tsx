import type { Meta, StoryObj } from "@storybook/react-vite"

import { DirectionProvider } from "@workspace/ui/components/direction"
import { Button } from "@workspace/ui/components/button"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A provider component that sets the text direction for your application.",
      },
    },
  },
  title: "Components/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: { type: "radio" },
      options: ["ltr", "rtl"],
    },
  },
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

export const LTR: Story = {
  args: { direction: "ltr" },
  render: (args) => (
    <DirectionProvider {...args}>
      <div dir={args.direction} className="flex gap-2">
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </DirectionProvider>
  ),
}

export const RTL: Story = {
  args: { direction: "rtl" },
  render: (args) => (
    <DirectionProvider {...args}>
      <div dir={args.direction} className="flex gap-2">
        <Button>حفظ</Button>
        <Button variant="outline">إلغاء</Button>
      </div>
    </DirectionProvider>
  ),
}
