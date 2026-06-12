import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Accessible resizable panel groups and layouts with keyboard support.",
      },
    },
  },
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label }: { label: string }) => (
  <div className="flex h-full items-center justify-center p-6">
    <span className="text-sm font-medium">{label}</span>
  </div>
)

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <Cell label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <Cell label="Two" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[300px] w-[400px] rounded-lg border"
    >
      <ResizablePanel defaultSize={40}>
        <Cell label="Header" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <Cell label="Content" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const WithHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] w-[450px] rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <Cell label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <Cell label="Main" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const NestedGroups: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[300px] w-[500px] rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <Cell label="Left" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={50}>
            <Cell label="Top" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <Cell label="Bottom" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the resize handle and its grip.",
    tokens: [
      { cssVar: "--border", utility: "bg-border", affects: "Handle divider & grip fill" },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible ring on the handle" },
      { cssVar: "--background", utility: "ring-offset-background", affects: "Focus ring offset color" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Grip corner radius (withHandle)",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Resizable's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Resizable. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
