import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: { component: "Displays a callout for user attention." },
    },
  },
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "destructive"],
    },
  },
  args: { variant: "default" },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        The reactor will enter scheduled maintenance at 02:00 UTC.
      </AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Alert variant="default">
        <InfoIcon />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The reactor will enter scheduled maintenance at 02:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>
          A new firmware version is ready to install.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2Icon />
        <AlertTitle>Deployment successful</AlertTitle>
        <AlertDescription>
          The new control parameters are now live across all cores.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangleIcon />
        <AlertTitle>Trial ending soon</AlertTitle>
        <AlertDescription>
          Your evaluation license expires in 3 days.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Coolant pressure low</AlertTitle>
        <AlertDescription>
          Pressure has dropped below the safe threshold. Investigate
          immediately.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new firmware version is ready to install.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          Install
        </Button>
      </AlertAction>
    </Alert>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description:
      "The default variant uses the neutral card surface; each status variant uses its derived *-subtle surface and same-hue foreground.",
    tokens: [
      {
        cssVar: "--card",
        utility: "bg-card",
        affects: "Default variant surface",
        foreground: {
          cssVar: "--card-foreground",
          utility: "text-card-foreground",
          affects: "Default variant title text",
        },
      },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Default variant description text" },
      {
        cssVar: "--destructive-subtle",
        utility: "bg-destructive-subtle",
        affects: "Destructive variant surface",
        foreground: {
          cssVar: "--destructive-subtle-foreground",
          utility: "text-destructive-subtle-foreground",
          affects: "Destructive variant title, description & icon",
        },
      },
      {
        cssVar: "--success-subtle",
        utility: "bg-success-subtle",
        affects: "Success variant surface",
        foreground: {
          cssVar: "--success-subtle-foreground",
          utility: "text-success-subtle-foreground",
          affects: "Success variant title, description & icon",
        },
      },
      {
        cssVar: "--warning-subtle",
        utility: "bg-warning-subtle",
        affects: "Warning variant surface",
        foreground: {
          cssVar: "--warning-subtle-foreground",
          utility: "text-warning-subtle-foreground",
          affects: "Warning variant title, description & icon",
        },
      },
      {
        cssVar: "--info-subtle",
        utility: "bg-info-subtle",
        affects: "Info variant surface",
        foreground: {
          cssVar: "--info-subtle-foreground",
          utility: "text-info-subtle-foreground",
          affects: "Info variant title, description & icon",
        },
      },
      { cssVar: "--destructive-subtle-border", utility: "border-destructive-subtle-border", affects: "Destructive variant border" },
      { cssVar: "--success-subtle-border", utility: "border-success-subtle-border", affects: "Success variant border" },
      { cssVar: "--warning-subtle-border", utility: "border-warning-subtle-border", affects: "Warning variant border" },
      { cssVar: "--info-subtle-border", utility: "border-info-subtle-border", affects: "Info variant border" },
      { cssVar: "--foreground", utility: "hover:text-foreground", affects: "Inline link hover color" },
      { cssVar: "--border", utility: "border", affects: "Default variant border" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Alert corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Alert's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Alert. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
