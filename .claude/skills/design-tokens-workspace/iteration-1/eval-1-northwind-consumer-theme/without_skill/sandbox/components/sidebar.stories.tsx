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
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

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
            <div className="px-2 py-1 text-sm font-semibold">
              Atomic Reactor
            </div>
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
