
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
import AddContributor from "./components/AddContributor"
import { debounce } from "lodash"





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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("role")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const user = row.original;

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
            <DropdownMenuContent align="end" className="text-white bg-black border-[1px] border-gray-800 w-48 sm:w-auto">


              {/* Show options based on user's block status */}
              {user.block ? (
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                  <AlertDialogTrigger onClick={() => setClickedItem(3)} className="w-full text-left">
                    Unblock User
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setClickedItem(1)} className="hover:bg-gray-800 cursor-pointer px-3">
                    <AlertDialogTrigger className="w-full text-left">
                      Promote to Moderator
                    </AlertDialogTrigger>
                  </DropdownMenuItem>

                 

                  <DropdownMenuItem onClick={() => setClickedItem(4)} className="hover:bg-gray-800 cursor-pointer px-3">
                    <AlertDialogTrigger className="w-full text-left">
                      Block User
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent className='bg-black border-gray-800 w-[90vw] max-w-md mx-auto'>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription className='h-16 sm:h-24' >
                <TriangleAlert className='w-16 h-16 sm:w-24 sm:h-24 mx-auto text-red-500' />
              </AlertDialogDescription>
              <AlertDialogDescription className='w-full h-auto py-4 text-center text-lg sm:text-2xl text-white'>
                Are you sure ?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction  className="w-full sm:w-auto"
                onClick={
                  clickedItem === 1
                    ? () => changeUserRole(user._id, user.role, userRoles.MODERATOR)
                    : clickedItem === 2
                      ? () => changeUserRole(user._id, user.role, userRoles.SUBSCRIBER)
                      : clickedItem === 3
                        ? () => unblockUser(user._id, user.role)
                        : clickedItem === 4
                          ? () => blockUser(user._id, user.role)
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


function User() {
  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  // const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})

  const { contributors, fetchUsers, isLoading, websiteKey, userPageNo, setUserPageNo }: any = useUserContext();
  const [searchQuery, setSearchQuery] = useState('');




  const debouncedSetSearchText = debounce((value: string) => {
    setSearchQuery(value);
  }, 900);

  const handleSearch = async (e: any) => {
    const { value } = e.target;
    debouncedSetSearchText(value);
  }

  useEffect(() => {
    if (websiteKey) fetchUsers(userRoles.CONTRIBUTOR, searchQuery);
  }, [websiteKey, userPageNo]);

  useEffect(() => {
    if (userPageNo === 1 && websiteKey) fetchUsers(userRoles.CONTRIBUTOR, searchQuery)

    setUserPageNo(1)
  }, [searchQuery])


  const table = useReactTable({
    data: contributors || [],
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
    <div className="w-full container mx-auto px-4 ">
      <div className="flex flex-row items-center justify-between py-4">
        <Input
          placeholder="Search..."
          onChange={handleSearch}
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />
        <AddContributor />
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
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2 py-4">
    <div className="text-xs sm:text-sm text-muted-foreground">
          Total {!isLoading ? table.getFilteredRowModel().rows.length : 0} rows.
        </div>
        <div className="space-x-2 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUserPageNo(userPageNo - 1)}
            disabled={userPageNo <= 1}
            className="text-black font-bold text-xs sm:text-sm px-2 sm:px-4"
          >
            Previous
          </Button>
          <div className="border-[1px] px-3 sm:px-4 py-[4px] rounded-lg border-gray-400 text-sm">{userPageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUserPageNo(userPageNo + 1)}
            disabled={contributors.length < 10}
            className="text-black font-bold text-xs sm:text-sm px-2 sm:px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default User;


