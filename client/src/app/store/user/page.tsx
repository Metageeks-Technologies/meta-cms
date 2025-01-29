"use client"
import * as React from "react"
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, TriangleAlert } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const dummyData = [
  { id: 1, name: "John Doe", email: "john@example.com", phoneNo: "1234567890", status: "active", role: "customer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phoneNo: "0987654321", status: "inactive", role: "customer" },
  // Add more dummy data as needed
];

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => <div className="">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNo",
    header: "Phone",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("phoneNo")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const user = row.original;
      const [clickedItem, setClickedItem] = useState(0);

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-white bg-black border-[1px] border-gray-800">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={() => setClickedItem(1)} className="hover:bg-gray-800 cursor-pointer px-3">
                Promote to Vendor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setClickedItem(2)} className="hover:bg-gray-800 cursor-pointer px-3">
                Promote to Moderator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setClickedItem(3)} className="hover:bg-gray-800 cursor-pointer px-3">
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent className='bg-black border-gray-800'>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription className='h-24'>
                <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
              </AlertDialogDescription>
              <AlertDialogDescription className='w-full h-20 text-center text-2xl text-white'>
                Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // Implement action logic based on clickedItem
                  if (clickedItem === 1) {
                    // Promote to Vendor logic
                  } else if (clickedItem === 2) {
                    // Promote to Moderator logic
                  } else if (clickedItem === 3) {
                    // Block logic
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]

function Customer() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: dummyData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full container mx-auto px-4">
      <div className="flex flex-col py-4">
        <Input
          placeholder="Search email..."
          value={(table?.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />
      </div>

      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-800">
                {headerGroup?.headers?.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-800 text-white text-lg font-bold">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-gray-800 hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {table.getFilteredRowModel().rows.length} rows.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-black font-bold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Customer;
