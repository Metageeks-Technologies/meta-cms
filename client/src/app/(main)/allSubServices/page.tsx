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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RiDeleteBinLine } from "react-icons/ri";
import { FaClockRotateLeft } from "react-icons/fa6";
import { usePageContext } from "@/context/pageContext"
import { useUserContext } from "@/context/userContext"
import AddSubServices from "./component/AddSubServices"
import { debounce } from "lodash"
const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }: any) => (
      <div>{row.getValue("key")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: any) => (
      <div>{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }: any) => {
      const isDeleted = row.getValue("isDeleted")
      return <div>{isDeleted ? <span className="text-red-500">InActive</span> : <span className="text-green-500">Active</span>}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const subServices = row.original;
      const [clickedItem, setClickedItem] = useState(0);
      const { recoverSubServices, deleteSubServices, services } = usePageContext();


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
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" /> */}
              {
                subServices.isDeleted ?
                  <DropdownMenuItem onClick={() => setClickedItem(1)} className="hover:bg-gray-800 cursor-pointer px-3">
                    <AlertDialogTrigger className="flex flex-row items-center gap-[10px]">
                      <FaClockRotateLeft className="scale-x-[-1]" /> Recover
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                  : <DropdownMenuItem onClick={() => setClickedItem(2)} className="hover:bg-gray-800 cursor-pointer px-3 text-red-500">
                    <AlertDialogTrigger className="flex flex-row items-center gap-[10px]">
                      <RiDeleteBinLine /> Delete
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
                    () => recoverSubServices(subServices._id, services[0]._id)
                    : clickedItem === 2 ?
                      () => deleteSubServices(subServices._id, services[0]._id)
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

const Page = () => {

  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { websiteKey } = useUserContext();
  const { subServices, fetchSubServices, services, fetchServices, fetchSubServicesTotal, subServicePageNo, setSubServicePageNo } = usePageContext();
  const [servicesFetched, setServicesFetched] = useState(false);
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState('');



  const debouncedSetSearchText = debounce((value: string) => {
    setSearchQuery(value);
  }, 900);

  const handleSearch = async (e: any) => {
    const { value } = e.target;
    debouncedSetSearchText(value);
  }


  useEffect(() => {
    if (websiteKey && !servicesFetched) {
      fetchServices();
      setServicesFetched(true);
    }
  }, [fetchServices, servicesFetched, websiteKey]);

  useEffect(() => {
    if (services.length > 0) {
      const defaultService = services[0]._id;
      setSelectedService(defaultService);
    }
  }, [services]);

  useEffect(() => {
    if (websiteKey && selectedService) {
      setSubServicePageNo(1);
      fetchSubServicesTotal(selectedService, searchQuery);
    }
  }, [selectedService, websiteKey, subServicePageNo]);

  useEffect(() => {
    if (subServicePageNo === 1 && websiteKey && selectedService) {
      fetchSubServicesTotal(selectedService, searchQuery);
    }
    setSubServicePageNo(1)
  }, [searchQuery])


  const table = useReactTable({
    data: subServices,
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

      <div className='flex mt-3 justify-end items-center gap-4 my-2 ml-auto'>
        {/* <label htmlFor="" className="text-lg font-bold">Service</label> */}
        <select
          className='bg-[#06040B] text-gray-200 border-[1px] border-gray-800 px-2 py-1 rounded-md'
          value={selectedService ?? (services.length > 0 ? services[0]._id : "")}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">---Select Service---</option>
          {services.map((service: any) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>

      </div>


      <div className="flex flex-row justify-between items-center py-4">

        {/* Search Input */}
        <Input
          placeholder="Search name..."
          onChange={handleSearch}
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />

        {/* Add SubServices Button */}
        <AddSubServices />
      </div>

      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-800">
                {headerGroup?.headers?.map((header) => (
                  <TableHead key={header.id} className="bg-gray-800 hover:none text-white text-lg font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
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
            onClick={() => setSubServicePageNo(subServicePageNo - 1)}
            disabled={subServicePageNo <= 1}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{subServicePageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubServicePageNo(subServicePageNo + 1)}
            disabled={subServices.length < 10}
            className="text-black font-bold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;


