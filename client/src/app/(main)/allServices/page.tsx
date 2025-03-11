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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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
import AddServices from "./comonent/AddServices"
import axiosCall from "@/utils/ApiCall"
import toast from "react-hot-toast"
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

      const services = row.original;
      const [clickedItem, setClickedItem] = useState(0);
      const router = useRouter();
      const { recoverServices, deleteServices, fetchAllServices } = usePageContext();
      const [isOpen, setIsOpen] = useState(false);
      const { user, setLoading, websiteKey }: any = useUserContext();
      const [servicess, setServicess] = useState(row.original);
      const handleCancel = () => {
        setServicess(row.original);
        setIsOpen(false);
      }

      const updateServices = async (id: string) => {

        if (!servicess.name.trim() || !servicess.description.trim()) {
          toast.error("Please fill in all fields correctly.", {
            duration: 2000,
          });
          setLoading(false);
          return;
        }


        setLoading(true);
        try {
          const payload = {
            name: servicess.name,
            description: servicess.description,
          }
          const resp = await axiosCall('put', `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`, payload, { websiteKey: websiteKey });


          if (resp.status === 200 || resp.status === 201) {
            toast.success(resp.data.message, {
              duration: 2000,
            });
            fetchAllServices();
            setIsOpen(false);
          } else {
            toast.error(resp.data.message, {
              duration: 2000,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }


      return (

        <Dialog open={isOpen} onOpenChange={setIsOpen}>

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
                  services.isDeleted ?
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
                <DropdownMenuItem onClick={() => {
                  setIsOpen(true); // Open the dialog
                }} className="hover:bg-gray-800 cursor-pointer px-3">
                  <VscPreview /> Update
                </DropdownMenuItem>



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
                      () => recoverServices(services._id)
                      : clickedItem === 2 ?
                        () => deleteServices(services._id)
                        : () => { }
                  }
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>
          <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className='text-2xl'>Update Services</DialogTitle>
            </DialogHeader>
            <form
              className="py-4"
              onSubmit={async (event: any) => {
                event.preventDefault(); // Prevent the default form submission behavior
                await updateServices(servicess._id);
              }}
            >
              <div className="mb-4">
                <Label htmlFor="name" className="text-right">
                  Service name
                </Label>
                <Input
                  id="name"
                  value={servicess.name}
                  placeholder='Enter Name'
                  className=""
                  onChange={(e) => setServicess({ ...servicess, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={servicess.description}
                  placeholder='Enter description'
                  className=""
                  onChange={(e) => setServicess({ ...servicess, description: e.target.value })}
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

const page = () => {

  const [sorting, setSorting] = useState<SortingState>([])
  const { websiteKey } = useUserContext();
  const { services, fetchAllServices, servicePageNo, setServicePageNo } = usePageContext();
  const [searchQuery, setSearchQuery] = useState('');


  const debouncedSetSearchText = debounce((value: string) => {
    setSearchQuery(value);
  }, 900);

  const handleSearch = async (e: any) => {
    const { value } = e.target;
    debouncedSetSearchText(value);
  }

  useEffect(() => {
    if (websiteKey) fetchAllServices(searchQuery);
  }, [websiteKey, servicePageNo])

  useEffect(() => {
    if(servicePageNo === 1 && websiteKey){
      fetchAllServices(searchQuery)
    }
    setServicePageNo(1)
  }, [searchQuery])

  


  const table = useReactTable({
    data: services,
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
      <div className="flex flex-row justify-between items-center py-4">
        <Input
          placeholder="Search name..."
          onChange={handleSearch}
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />
        <AddServices />
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
            onClick={() => setServicePageNo(servicePageNo - 1)}
            disabled={servicePageNo <= 1}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{servicePageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setServicePageNo(servicePageNo + 1)}
            disabled={services.length < 10}
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