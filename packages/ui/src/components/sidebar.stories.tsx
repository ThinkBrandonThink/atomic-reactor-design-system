import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import {
  AtomIcon,
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "radio",
      options: ["left", "right"],
    },
    variant: {
      control: "radio",
      options: ["sidebar", "floating", "inset"],
    },
    collapsible: {
      control: "radio",
      options: ["offcanvas", "icon", "none"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A composable, themeable and customizable sidebar component.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { title: "Home", icon: HomeIcon, badge: undefined },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Calendar", icon: CalendarIcon, badge: undefined },
  { title: "Search", icon: SearchIcon, badge: undefined },
  { title: "Settings", icon: SettingsIcon, badge: undefined },
]

export const Default: Story = {
  render: (args) => (
    <div className="h-[32rem]">
      <SidebarProvider>
        <Sidebar {...args}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <AtomIcon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Atomic Reactor</span>
                    <span className="text-muted-foreground text-xs">Design System</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item, i) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={i === 0}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              brandon@atomicjolt.com
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <main className="p-4 text-sm text-muted-foreground">
            Toggle the sidebar with the trigger button or Cmd/Ctrl + B.
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export const IconCollapsible: Story = {
  args: { collapsible: "icon" },
  render: Default.render,
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface colors",
    description: "The sidebar panel surface and its text.",
    tokens: [
      {
        cssVar: "--sidebar",
        utility: "bg-sidebar",
        affects: "Sidebar panel background",
        foreground: {
          cssVar: "--sidebar-foreground",
          utility: "text-sidebar-foreground",
          affects: "Sidebar text & icons",
        },
      },
      { cssVar: "--background", utility: "bg-background", affects: "Inset / input / outline menu-button background" },
    ],
  },
  {
    title: "Accent colors",
    description: "Hover / active / focus states on menu items, actions, and sub-items.",
    tokens: [
      {
        cssVar: "--sidebar-accent",
        utility: "bg-sidebar-accent",
        affects: "Menu item hover / active background",
        foreground: {
          cssVar: "--sidebar-accent-foreground",
          utility: "text-sidebar-accent-foreground",
          affects: "Menu item hover / active text",
        },
      },
      { cssVar: "--sidebar-border", utility: "border-sidebar-border", affects: "Separator, sub-menu border, rail hover, floating ring" },
    ],
  },
  {
    title: "Focus",
    tokens: [
      { cssVar: "--sidebar-ring", utility: "ring-sidebar-ring", affects: "Focus-visible ring on menu buttons & actions" },
    ],
  },
  {
    title: "Radius",
    description: "Corner radii used across the sidebar surfaces.",
    tokens: [
      { cssVar: "--radius-md", utility: "rounded-md", affects: "Menu items, actions, badges, group labels", radius: true },
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Floating variant panel", radius: true },
      { cssVar: "--radius-xl", utility: "rounded-xl", affects: "Inset variant content panel", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Sidebar's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Sidebar. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
