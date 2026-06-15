import type { Meta, StoryObj } from "@storybook/react-vite"

import { SidebarBlock07 } from "./sidebar-07"

/**
 * A sidebar that collapses to icons, composed from the design system's Sidebar,
 * Collapsible, DropdownMenu, Avatar, and Breadcrumb components. Adapted from
 * shadcn's `sidebar-07` block to Base UI + the Atomic Reactor tokens.
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
          "A sidebar that collapses to icons, with a team switcher, collapsible nav groups, a projects list with row actions, and a user menu.",
      },
    },
  },
} satisfies Meta<typeof SidebarBlock07>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
