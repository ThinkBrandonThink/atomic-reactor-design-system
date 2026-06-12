import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@workspace/ui/components/pagination"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Pagination with page navigation, next and previous links.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const Controlled: Story = {
  render: () => {
    const pages = [1, 2, 3, 4, 5]
    const [page, setPage] = React.useState(1)

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setPage((p) => Math.max(1, p - 1))
              }}
            />
          </PaginationItem>
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault()
                  setPage(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setPage((p) => Math.min(pages.length, p + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description:
      "Pagination renders its links as Buttons — active pages use the outline variant, the rest use ghost. These are the semantic tokens those variants apply.",
    tokens: [
      { cssVar: "--background", utility: "bg-background", affects: "Active page (outline) background" },
      { cssVar: "--border", utility: "border-border", affects: "Active page (outline) border" },
      { cssVar: "--input", utility: "border-input", affects: "Active page border & background (dark mode)" },
      { cssVar: "--muted", utility: "bg-muted", affects: "Link hover background" },
      { cssVar: "--foreground", utility: "text-foreground", affects: "Link hover text" },
    ],
  },
  {
    title: "Focus",
    tokens: [{ cssVar: "--ring", utility: "ring-ring", affects: "Focus-visible border & ring" }],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--button-radius",
        utility: "rounded-(--button-radius)",
        affects: "Page link corner radius (inherited from Button, defaults to --radius-lg)",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Pagination's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Pagination. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
