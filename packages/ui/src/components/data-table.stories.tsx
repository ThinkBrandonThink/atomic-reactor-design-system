import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"

import {
  DataTable,
  DataTableColumnHeader,
  type ColumnDef,
} from "@workspace/ui/components/data-table"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// Bind the generic component to a concrete row type so story args type-check
// (a bare `typeof DataTable` erases the generics to `unknown`).
const DataTablePayment = DataTable<Payment, unknown>

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "A data table built on TanStack Table over the Table primitives. Supports sorting, column-filtering, column visibility, row selection, and pagination. Define `columns` with `ColumnDef`s and pass your `data`.",
      },
    },
  },
  title: "Components/Data Table",
  component: DataTablePayment,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTablePayment>

export default meta
type Story = StoryObj<typeof meta>

const data: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "p0r9wq2x", amount: 159, status: "pending", email: "noah.b@example.com" },
  { id: "kx72mn1c", amount: 432, status: "success", email: "ava.lee@example.com" },
  { id: "qz88vt5l", amount: 980, status: "processing", email: "liam.k@example.com" },
  { id: "wd34hs9b", amount: 64, status: "failed", email: "mia.r@example.com" },
  { id: "ft91ja2k", amount: 555, status: "pending", email: "oliver@example.com" },
  { id: "yc06lp8r", amount: 290, status: "success", email: "emma.s@example.com" },
  { id: "vn23bd7m", amount: 712, status: "processing", email: "lucas@example.com" },
  { id: "ab19cd4e", amount: 401, status: "success", email: "sophia@example.com" },
]

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(!!checked)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("status")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-end font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="ms-auto flex">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export const Default: Story = {
  args: {
    columns,
    data,
    filterColumn: "email",
    filterPlaceholder: "Filter emails…",
  },
  render: (args) => (
    <div className="w-[760px]">
      <DataTable {...args} />
    </div>
  ),
}

export const WithoutToolbarFilter: Story = {
  args: { columns, data },
  render: (args) => (
    <div className="w-[760px]">
      <DataTable {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: { columns, data: [], filterColumn: "email" },
  render: (args) => (
    <div className="w-[760px]">
      <DataTable {...args} />
    </div>
  ),
}
