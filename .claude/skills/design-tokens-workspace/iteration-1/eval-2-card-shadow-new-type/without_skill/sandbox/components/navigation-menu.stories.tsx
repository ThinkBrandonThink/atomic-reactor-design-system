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
