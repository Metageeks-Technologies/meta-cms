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

import { useAuth } from '@/hooks/useAuth';
import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"
import { usePostContext } from "@/context/postContext"
import { RiDeleteBin6Line } from "react-icons/ri";
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
import AddCategory from "./component/AddCategory"



const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "bannerImageKey",
    header: "Image",
    cell: ({ row }: any) => {
      const imageUrl = row.getValue("bannerImageKey");
      return (
        <div className="flex items-center justify-start">
          {imageUrl ? (
            <img
              // src={imageUrl}
              src="/blogImg.png"
              alt="Category Image"
              className="h-20 w-32 object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-500">No image</span>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "description",
    header: () => <div className="">Description</div>,
    cell: ({ row }: any) => (
      <div className="">{row.getValue("description")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const category = row.original;
      const { deleteCategory } = usePostContext();
      const { user }: any = useUserContext();

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

              {
                user?.role === userRoles.SUPERADMIN &&
                <AlertDialogTrigger>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                    <RiDeleteBin6Line className="text-red-500" />
                    Delete category
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              }

            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent className='bg-black border-gray-800'>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription className='h-24' >
                <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
              </AlertDialogDescription>
              <AlertDialogDescription className='w-full text-center mb-5 text-lg text-white'>
                Delete Category
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteCategory(category._id)} className='bg-red-500 hover:bg-red-600'>Delete</AlertDialogAction>
            </AlertDialogFooter>

          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]





function Category() {

  useAuth();

  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const { categories, fetchCategories }: any = usePostContext()
  const { user }: any = useUserContext();

  // console.log(categories);

  const table = useReactTable({
    data: categories,
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
    fetchCategories();
  }, []);



  return (
    <div className="w-full container mx-auto">
      <div className="flex flex-col py-4">
        <h2 className="my-3 text-2xl font-bold">All Categories</h2>
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
            <AddCategory />
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