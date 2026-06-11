import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { CodeIcon, EyeIcon, SettingsIcon } from "lucide-react"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the tab list.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="preview" className="w-[26rem]">
      <TabsList>
        <TabsTrigger value="preview">
          <EyeIcon data-icon="inline-start" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon data-icon="inline-start" />
          Code
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon data-icon="inline-start" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="pt-2">
        Rendered preview of the component in the showcase app.
      </TabsContent>
      <TabsContent value="code" className="pt-2">
        Source code and import snippet for the component.
      </TabsContent>
      <TabsContent value="settings" className="pt-2">
        Variant and prop controls for the component.
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="preview" className="w-[26rem]">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="pt-2">
        Rendered preview of the component in the showcase app.
      </TabsContent>
      <TabsContent value="code" className="pt-2">
        Source code and import snippet for the component.
      </TabsContent>
      <TabsContent value="settings" className="pt-2">
        Variant and prop controls for the component.
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Tabs {...args} defaultValue="preview" className="w-[28rem]">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        Rendered preview of the component.
      </TabsContent>
      <TabsContent value="code">Source code and import snippet.</TabsContent>
      <TabsContent value="settings">Variant and prop controls.</TabsContent>
    </Tabs>
  ),
}
