import type { Meta, StoryObj } from "@storybook/react-vite"

import { SidebarBlock07 } from "./sidebar-07"

/**
 * A sidebar that collapses to icons, composed from the design system's Sidebar,
 * Collapsible, DropdownMenu, Avatar, Button, and Breadcrumb components. Adapted
 * from shadcn's `sidebar-07` block to Base UI + the Atomic Reactor tokens.
 *
 * Toggle the sidebar with the trigger button or Cmd/Ctrl + B.
 */
const meta = {
  title: "Blocks/Sidebar 07",
  component: SidebarBlock07,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A sidebar that collapses to icons. A top bar holds the breadcrumbs plus a notification button and the user menu; the sidebar itself has a brand logo header, a main nav mixing direct links (Dashboard, Users) with collapsible groups whose sub-items appear in a flyout when collapsed, an example section for things like a projects list with row actions, and secondary links (Documentation, Settings) pinned to the bottom.",
      },
    },
  },
} satisfies Meta<typeof SidebarBlock07>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
