import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { EllipsisIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays a card with header, content, and footer.",
      },
    },
  },
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
  args: { size: "default" },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Reactor status</CardTitle>
        <CardDescription>Core temperature nominal.</CardDescription>
      </CardHeader>
      <CardContent>
        All subsystems are operating within expected parameters.
      </CardContent>
    </Card>
  ),
}

export const Full: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Deploy reactor</CardTitle>
        <CardDescription>
          Push the current configuration to production.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="More options">
            <EllipsisIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        This will roll out the new control parameters to all active cores.
        Existing sessions remain unaffected.
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Deploy</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <img
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&dpr=2&q=80"
        alt="Circuit board close-up"
        className="aspect-video object-cover"
      />
      <CardHeader>
        <CardTitle>Control module</CardTitle>
        <CardDescription>Hardware revision 2.4</CardDescription>
      </CardHeader>
      <CardContent>
        The latest control module ships with redundant sensor arrays and a
        faster sampling loop.
      </CardContent>
      <CardFooter>
        <Button className="w-full">View specs</Button>
      </CardFooter>
    </Card>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Card size="default" className="w-72">
        <CardHeader>
          <CardTitle>Default size</CardTitle>
          <CardDescription>Standard card spacing.</CardDescription>
        </CardHeader>
        <CardContent>Comfortable padding for most layouts.</CardContent>
      </Card>
      <Card size="sm" className="w-72">
        <CardHeader>
          <CardTitle>Small size</CardTitle>
          <CardDescription>Condensed card spacing.</CardDescription>
        </CardHeader>
        <CardContent>Tighter padding for dense layouts.</CardContent>
      </Card>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface",
    description: "The card surface and its text.",
    tokens: [
      {
        cssVar: "--card",
        utility: "bg-card",
        affects: "Card background",
        foreground: {
          cssVar: "--card-foreground",
          utility: "text-card-foreground",
          affects: "Card text",
        },
      },
    ],
  },
  {
    title: "Detail colors",
    description: "Secondary surfaces and borders within the card.",
    tokens: [
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Description text" },
      { cssVar: "--muted", utility: "bg-muted/50", affects: "Footer background tint" },
      { cssVar: "--border", utility: "border-t", affects: "Footer top border" },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Card outline ring (10% tint)" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--card-radius",
        utility: "rounded-(--card-radius)",
        affects:
          "Outer corners, header/footer & first/last image (defaults to --radius-xl)",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Card's appearance. Swatches and values update live with the active theme.
 *
 * Note: `--card-spacing` (the padding/gap knob) is set on the card element
 * itself and switched by the `size` prop, so it isn't listed here — see the
 * Sizes story for that.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Card. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
