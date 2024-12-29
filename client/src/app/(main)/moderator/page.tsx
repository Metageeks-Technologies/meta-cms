"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

import { useAuth } from '@/hooks/useAuth';
import axiosCall from "@/utils/ApiCall"
import toast from "react-hot-toast"
import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"



export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => (
      <div className="">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phoneNo",
    header: "Phone",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("phoneNo")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-right">Role</div>,
    cell: ({ row }: any) => (
      <div className="capitalize text-right">{row.getValue("role")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const user = row.original;

      const { fetchAllModerator } : any = useUserContext();


      const demoteToContributor = async () => {
        try {
          toast.loading('Loading...');
          const payload = {
            "_id": user._id,
            "newRole": userRoles.CONTRIBUTOR
          }
          const resp = await axiosCall('put', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-role`, payload);

          if(resp.status === 200 || resp.status === 201) {
            fetchAllModerator();
            toast.dismiss();
            toast.success(resp.data.message, {
              duration: 2000,
            });
          }else{
            toast.error(resp.data.message, {
              duration: 2000,
            });
          }

        } catch (error) {
          console.log(error);
        }
      }



      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-white bg-black borrder-[1px] border-gray-800">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem onClick={demoteToContributor} className="hover:bg-gray-800 cursor-pointer px-3">Demote to Contributor</DropdownMenuItem>
            {/* <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">View customer</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]




function User() {

  useAuth();

  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const {moderator, fetchAllModerator} : any = useUserContext()


  const table = useReactTable({
    data: moderator,
    columns,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      // columnFilters,
      // columnVisibility,
      // rowSelection,
    },
  });

  
  useEffect(() => {
    fetchAllModerator();
  }, []);



  return (
    <div className="w-full container mx-auto">
      <div className="flex flex-col py-4">
        <h2 className="my-3 text-2xl font-bold">All Moderator</h2>
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
                    <TableHead key={header.id} className="bg-gray-800 hover:none text-white text-lg font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>


          <TableBody className="">
            {table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-800 hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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

export default User;


