import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command"
import { Button } from "@workspace/ui/components/button"
import {
  CalendarIcon,
  CalculatorIcon,
  CreditCardIcon,
  GaugeIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

const meta = {
  parameters: {
    docs: {
      description: { component: "Command menu for search and quick actions." },
    },
  },
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Command className="max-w-md ring-1 ring-foreground/10">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Search emoji</span>
          </CommandItem>
          <CommandItem>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const InDialog: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false)

      React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
      }, [])

      return (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            Press{" "}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">
              ⌘K
            </kbd>{" "}
            or click the button.
          </p>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open command palette
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Reactors">
                <CommandItem>
                  <GaugeIcon />
                  <span>Core-A telemetry</span>
                </CommandItem>
                <CommandItem>
                  <GaugeIcon />
                  <span>Core-B telemetry</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem>
                  <CalendarIcon />
                  <span>Schedule maintenance</span>
                  <CommandShortcut>⌘M</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <SettingsIcon />
                  <span>Open settings</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </>
      )
    }

    return <Demo />
  },
}
