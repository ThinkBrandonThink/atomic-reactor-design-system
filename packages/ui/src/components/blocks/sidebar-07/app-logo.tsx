"use client"

import * as React from "react"
import { Atom } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

export function AppLogo({
  logo,
  label = "Atomic Reactor",
}: {
  /**
   * The logo mark. Defaults to the Atomic Reactor mark; pass a client's
   * uploaded logo (e.g. an `<img>`) to override it.
   */
  logo?: React.ReactNode
  /** The logo text shown beside the mark. */
  label?: string
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm transition-[width,padding] duration-200 ease-linear group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0">
          {logo ?? (
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Atom className="size-4" />
            </div>
          )}
          <span className="truncate font-medium">{label}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
