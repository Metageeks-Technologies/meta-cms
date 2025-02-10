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
import { useRouter } from "next/navigation"
import { RiDeleteBinLine } from "react-icons/ri";
import { FaClockRotateLeft } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";
import { usePageContext } from "@/context/pageContext"
import { useUserContext } from "@/context/userContext"




const columns = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: any) => (
      <div className="">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }: any) => (
      <div>{row.getValue("slug")}</div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }: any) => {
      const isDeleted = row.getValue("isDeleted")
      return <div>{isDeleted? <span className="text-red-500">InActive</span> : <span className="text-green-500">Active</span>}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const page = row.original;
      const [clickedItem, setClickedItem] = useState(0);
      const router = useRouter();
      const {recoverPage, deletePage} = usePageContext();
      

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

              <DropdownMenuItem onClick={() => router.push(`page/${page.slug}`)} className="cursor-pointer px-3">
                <VscPreview /> Preview Page
              </DropdownMenuItem>

              {
                page.isDeleted ?
                  <DropdownMenuItem onClick={() => setClickedItem(1)} className="hover:bg-gray-800 cursor-pointer px-3">
                    <AlertDialogTrigger className="flex flex-row items-center gap-[10px]">
                      <FaClockRotateLeft className="scale-x-[-1]" /> Recover Page
                    </AlertDialogTrigger>
                  </DropdownMenuItem>

                  : <DropdownMenuItem onClick={() => setClickedItem(2)} className="hover:bg-gray-800 cursor-pointer px-3 text-red-500">
                    <AlertDialogTrigger className="flex flex-row items-center gap-[10px]">
                      <RiDeleteBinLine /> Delete Page
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
              }

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
                  clickedItem === 1 ?
                    () => recoverPage(page._id)
                    : clickedItem === 2 ?
                      () => deletePage(page._id)
                      : () => { }
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

const page = () => {

  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const {websiteKey} = useUserContext();
  const { pageData, fetchPageData } = usePageContext();

  useEffect(() => {
    if(websiteKey) fetchPageData();
  }, [websiteKey])


  const table = useReactTable({
    data: pageData,
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




  return (
    <div className="w-full container mx-auto px-4">
      <div className="flex flex-col py-4">
        <Input
          placeholder="Search title..."
          value={(table?.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("title")?.setFilterValue(event.target.value)
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
  )
}

export default page