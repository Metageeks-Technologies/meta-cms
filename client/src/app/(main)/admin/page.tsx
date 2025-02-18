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

import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"
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
import AddAdmin from "./component/AddAdmin"



const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }: any) => (
      <div>{row.getValue("website")?.name}</div>
    ),
  },

  {
    accessorKey: "website key",
    header: "Website key",
    cell: ({ row }: any) => (
      <div>{row.getValue("website")?.key}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => (
      <div>{row.getValue("email")}</div>
    ),
  }
  ,
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const user = row.original;
      return (
        <div
          className={`${user.block ? "text-red-500" : "text-green-500"
            } font-semibold`}
        >
          {user.block ? "Inactive" : "Active"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const user = row.original;
      const [clickedItem, setClickedItem] = useState(0);
      const { blockUser, unblockUser }: any = useUserContext();

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
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuSeparator className="bg-gray-800" />



              {/* block /unblock options */}
              {user.block ? (
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                  <AlertDialogTrigger onClick={() => setClickedItem(1)} className="w-full text-left">
                    Unblock Admin
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              ) : (
                <>

                  <DropdownMenuItem onClick={() => setClickedItem(2)} className="hover:bg-gray-800 cursor-pointer px-3">
                    <AlertDialogTrigger className="w-full text-left">
                      Block Admin
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
                onClick={clickedItem === 1 ? () => unblockUser(user._id, user.role)
                  : clickedItem === 2 ? () => blockUser(user._id, user.role)
                    : () => { }}
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
  const { adminData, fetchAdmins, adminPageNo, setAdminPageNo } = useUserContext();



  const table = useReactTable({
    data: adminData,
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


  useEffect(() => {
    fetchAdmins();
  }, [adminPageNo]);



  return (
    <div className="w-full container mx-auto px-4">
      <div className="flex flex-row justify-between items-center py-4">
        <Input
          placeholder="Search email..."
          value={(table?.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />

        <AddAdmin />
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
        <div className="space-x-2 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminPageNo(adminPageNo - 1)}
            disabled={adminPageNo <= 1}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{adminPageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminPageNo(adminPageNo + 1)}
            disabled={adminData.length < 10}
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


