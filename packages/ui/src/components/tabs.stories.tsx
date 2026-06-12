import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { CodeIcon, EyeIcon, SettingsIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

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

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the tab list, triggers, and active state.",
    tokens: [
      { cssVar: "--muted", utility: "bg-muted", affects: "Default-variant tab list background" },
      {
        cssVar: "--background",
        utility: "bg-background",
        affects: "Active trigger background (default variant)",
      },
      {
        cssVar: "--foreground",
        utility: "text-foreground",
        affects: "Trigger text · hover & active text · line-variant indicator",
      },
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Tab list text · trigger text (dark)",
      },
      {
        cssVar: "--input",
        utility: "border-input",
        affects: "Active trigger border & background (dark)",
      },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border, ring & outline" }],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Tab list corner radius", radius: true },
      { cssVar: "--radius-md", utility: "rounded-md", affects: "Trigger corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Tabs' appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Tabs. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
