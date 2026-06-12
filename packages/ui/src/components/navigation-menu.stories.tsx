import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@workspace/ui/components/navigation-menu"
import { BookOpenIcon, LayersIcon, RocketIcon } from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "radio",
      options: ["start", "center", "end"],
      description: "Alignment of the popup relative to the trigger.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "A collection of links for navigating websites.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[20rem] gap-1">
              <NavigationMenuLink href="#">
                <RocketIcon />
                <div>
                  <div className="font-medium">Introduction</div>
                  <p className="text-muted-foreground">
                    Install and configure the design system.
                  </p>
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <LayersIcon />
                <div>
                  <div className="font-medium">Architecture</div>
                  <p className="text-muted-foreground">
                    How the monorepo and packages fit together.
                  </p>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[20rem] gap-1">
              <NavigationMenuLink href="#">
                <BookOpenIcon />
                <div>
                  <div className="font-medium">Navigation</div>
                  <p className="text-muted-foreground">
                    Tabs, breadcrumb, pagination and more.
                  </p>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by the triggers, links, popup surface, and indicator.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Dropdown popup surface",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Popup content text",
        },
      },
      { cssVar: "--muted", utility: "bg-muted", affects: "Trigger / link hover, focus & active background" },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Popup surface hairline ring" },
      { cssVar: "--border", utility: "bg-border", affects: "Indicator arrow fill" },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible ring on triggers & links" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Trigger, link & popup corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-md",
        utility: "rounded-md",
        affects: "Link corner radius inside content",
        radius: true,
      },
      {
        cssVar: "--radius-sm",
        utility: "rounded-ss-sm",
        affects: "Indicator arrow corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * NavigationMenu's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the NavigationMenu. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
