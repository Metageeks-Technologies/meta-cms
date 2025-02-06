"use client"
import * as React from "react"
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { MoreHorizontal, TriangleAlert } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"
import { usePostContext } from "@/context/postContext"
import { RiDeleteBin6Line } from "react-icons/ri";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { getURL } from "@/utils/AWS_Config"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosCall from "@/utils/ApiCall"
import { uploadToS3 } from "@/utils/helperFunction"
import { MdOutlineUpdate } from "react-icons/md";
import { StoreRole } from "@/constant/store"
import { useWebsiteContext } from "@/context/websiteContext"
import AddWebsite from "./component/AddWebsite"

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "key",
    header: "Website key",
    cell: ({ row }: any) => (
      <div className="">{row.getValue("key")}</div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("isDeleted")
      return <div className="">{status ? <span className="text-red-500">InActive</span> : <span className="text-green-500">Active</span>}</div>
    },
  },
  {
    header: "Action",
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const [isOpen, setIsOpen] = useState(false);
      const [website, setWebsite] = useState(row.original);
      const { user }: any = useUserContext();
      const { deleteWebsite, recoverWebsite, updateWebsite } = useWebsiteContext();
      const [clickedItem, setClickedItem] = useState(0);

      const handleNonSuperAdminClick = () => {
        toast.error("Only Superadmin has permission for this");
      };

      const handleCancel = () => {
        setWebsite(row.original);
        setIsOpen(false);
      }

      useEffect(() => {
        setWebsite(row.original);
      }, [row.original]);


      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialog>
            {
              user?.role === userRoles.SUPERADMIN && user?.storeRole === StoreRole.SUPERADMIN ? (
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

                    {
                      website.isDeleted ?
                        <AlertDialogTrigger>
                          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3" onClick={() => setClickedItem(1)}>
                            <MdOutlineUpdate className="" />
                            Recover website
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        :
                        <AlertDialogTrigger>
                          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3" onClick={() => setClickedItem(2)}>
                            <RiDeleteBin6Line className="text-red-500" />
                            Delete website
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                    }

                    <DialogTrigger asChild>
                      <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                        <MdOutlineUpdate />
                        Update website
                      </DropdownMenuItem>
                    </DialogTrigger>



                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // for the non superadmin role
                <div className="text-gray-500">
                  <MoreHorizontal onClick={handleNonSuperAdminClick} />
                </div>
              )
            }


            <AlertDialogContent className='bg-black border-gray-800'>
              <AlertDialogHeader>
                <AlertDialogTitle></AlertDialogTitle>
                <AlertDialogDescription className='h-24' >
                  <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
                </AlertDialogDescription>
                <AlertDialogDescription className='w-full text-center mb-5 text-lg text-white'>
                  Are you sure ?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={
                    clickedItem === 1 ?
                      () => recoverWebsite(website._id)
                      : clickedItem === 2 ?
                        () => deleteWebsite(website._id)
                        : () => { }
                  }
                  className={`${website.isDeleted ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>{website.isDeleted ? "Recover" : "Delete"}</AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>




          <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className='text-2xl'>Update website</DialogTitle>
            </DialogHeader>
            <form className="py-4" onSubmit={(e) => updateWebsite(e, website, setIsOpen)}>
              <div className="mb-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={website.name}
                  placeholder='Enter Website Name'
                  className=""
                  onChange={(e) => setWebsite({ ...website, name: e.target.value })}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )
    },
  },
]

function Category() {
  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const { user }: any = useUserContext();
  const { websiteData, fetchWebsiteData } = useWebsiteContext()


  // console.log(categories);

  const table = useReactTable({
    data: websiteData,
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
    fetchWebsiteData();
  }, []);



  return (
    <div className="w-full container mx-auto px-4">
      <div className="flex flex-col py-4">
        <div className="flex flex-row items-center justify-between">
          <Input
            placeholder="Search name..."
            value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table?.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-[1px] border-gray-800 text-base"
          />

          {
            user?.role === userRoles.SUPERADMIN &&
            <AddWebsite />
          }

        </div>
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
export default Category;