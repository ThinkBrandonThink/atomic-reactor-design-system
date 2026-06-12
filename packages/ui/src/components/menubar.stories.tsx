import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@workspace/ui/components/menubar"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.",
      },
    },
  },
  title: "Components/Menubar",
  component: Menubar,
  tags: ["autodocs"],
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reload</MenubarItem>
          <MenubarItem disabled>Force Reload</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Toggle Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithSelections: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(true)
    const [showFullUrls, setShowFullUrls] = React.useState(false)
    const [profile, setProfile] = React.useState("benoit")
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showBookmarks}
              onCheckedChange={setShowBookmarks}
            >
              Always Show Bookmarks Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showFullUrls}
              onCheckedChange={setShowFullUrls}
            >
              Always Show Full URLs
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
  },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Surface colors",
    description: "Semantic tokens for the menu bar, the dropdown content surface, and triggers.",
    tokens: [
      {
        cssVar: "--popover",
        utility: "bg-popover",
        affects: "Dropdown / sub-menu content surface",
        foreground: {
          cssVar: "--popover-foreground",
          utility: "text-popover-foreground",
          affects: "Dropdown content text",
        },
      },
      { cssVar: "--muted", utility: "bg-muted", affects: "Trigger hover & open background" },
      { cssVar: "--foreground", utility: "ring-foreground/10", affects: "Content surface hairline ring" },
      { cssVar: "--border", utility: "bg-border", affects: "Separator line" },
      { cssVar: "--muted-foreground", utility: "text-muted-foreground", affects: "Shortcut text" },
    ],
  },
  {
    title: "Item colors",
    description: "Tokens for focused (highlighted) and destructive menu items.",
    tokens: [
      {
        cssVar: "--accent",
        utility: "bg-accent",
        affects: "Focused / highlighted item background",
        foreground: {
          cssVar: "--accent-foreground",
          utility: "text-accent-foreground",
          affects: "Focused item text",
        },
      },
      {
        cssVar: "--destructive",
        utility: "text-destructive",
        affects: "Destructive item text & focus background tint",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Menu bar & dropdown content corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-md",
        utility: "rounded-md",
        affects: "Item corner radius",
        radius: true,
      },
      {
        cssVar: "--radius-sm",
        utility: "rounded-sm",
        affects: "Trigger corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Menubar's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Menubar. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
