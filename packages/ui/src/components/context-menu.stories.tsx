import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component: "Displays a menu of actions triggered by a right click.",
      },
    },
  },
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

const TriggerArea = ({ children }: { children: React.ReactNode }) => (
  <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
    {children}
  </ContextMenuTrigger>
)

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <TriggerArea>Right click here</TriggerArea>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <TriggerArea>Right click for more</TriggerArea>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email link</ContextMenuItem>
              <ContextMenuItem>Copy link</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Embed</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithCheckboxesAndRadio: Story = {
  render: () => {
    const [bookmarks, setBookmarks] = React.useState(true)
    const [fullUrls, setFullUrls] = React.useState(false)
    const [person, setPerson] = React.useState("pedro")
    return (
      <ContextMenu>
        <TriggerArea>Right click here</TriggerArea>
        <ContextMenuContent className="w-56">
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={fullUrls}
            onCheckedChange={setFullUrls}
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Tokens for the menu surface, items, labels, and the destructive variant.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Menu content background",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Menu content text",
        },
      },
      {
        cssVar: "--accent",
        utility: "bg-accent",
        affects: "Focused / open item & sub-trigger background",
        foreground: {
          cssVar: "--accent-foreground",
          utility: "text-accent-foreground",
          affects: "Focused item text",
        },
      },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Menu hairline ring" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Group label & shortcut text" },
      { cssVar: "--destructive", utility: "text-destructive", affects: "Destructive item text & hover tint" },
      { cssVar: "--border", utility: "bg-border", affects: "Separator line" },
    ],
  },
  {
    title: "Radius",
    tokens: [
      { cssVar: "--radius-lg", utility: "rounded-lg", affects: "Menu content corner radius", radius: true },
      { cssVar: "--radius-md", utility: "rounded-md", affects: "Item corner radius", radius: true },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * ContextMenu's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the ContextMenu. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
