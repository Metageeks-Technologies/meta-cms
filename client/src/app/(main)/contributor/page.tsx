
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
import axiosCall from "@/utils/ApiCall"
import toast from "react-hot-toast"
import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"





const columns = [
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
     // console.log(user)
      const [clickedItem, setClickedItem] = useState(0);
      const { changeUserRole, blockUser, unblockUser }: any = useUserContext();



      return (
        <AlertDialog>
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

                {/* Show options based on user's block status */}
                {user.block ? (
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                <AlertDialogTrigger onClick={() => setClickedItem(3)}>
                  Unblock User
                </AlertDialogTrigger>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setClickedItem(1)} className="hover:bg-gray-800 cursor-pointer px-3">
                  <AlertDialogTrigger>
                    Promote to Moderator
                  </AlertDialogTrigger>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setClickedItem(2)} className="hover:bg-gray-800 cursor-pointer px-3">
                  <AlertDialogTrigger>
                    Demote to Subscriber
                  </AlertDialogTrigger>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setClickedItem(4)} className="hover:bg-gray-800 cursor-pointer px-3">
                  <AlertDialogTrigger>
                    Block User
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </>
            )}

            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent className='bg-black border-gray-800'>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription className='h-24' >
                <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
              </AlertDialogDescription>
              <AlertDialogDescription className='w-full h-20 text-center text-2xl text-white'>
                Are you sure ?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
  onClick={
    clickedItem === 1
      ? () => changeUserRole(user._id, user.role, userRoles.MODERATOR)
      : clickedItem === 2
      ? () => changeUserRole(user._id, user.role, userRoles.SUBSCRIBER)
      : clickedItem === 3
      ? () => unblockUser(user._id)
      : clickedItem === 4
      ? () => blockUser(user._id)
      : () => {}
  }
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


function User() {
  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const { contributors, fetchUsers, isLoading }: any = useUserContext();

  const table = useReactTable({
    data: contributors,
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
    fetchUsers(userRoles.CONTRIBUTOR);
  }, []);

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
            {
              !isLoading &&
                table?.getRowModel()?.rows?.length ? (
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
                    {isLoading ? "Loading..." : "No results."}
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {!isLoading ? table.getFilteredRowModel().rows.length : 0} rows.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!isLoading && !table.getCanPreviousPage()}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!isLoading && !table.getCanNextPage()}
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


