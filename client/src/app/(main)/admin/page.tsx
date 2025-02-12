'use client'
import * as React from "react";
import { SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";
import { useUserContext } from "@/context/userContext";
import { userRoles } from "@/constant/user";
import AddAdmin from "./component/AddAdmin";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import axiosCall from "@/utils/ApiCall";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "websiteName",
    header: "Website Name",
    cell: ({ row }: any) => {
      const website = row.original.website;  // Access `website` from the original row object
      return <div className="capitalize">{website?.name || "N/A"}</div>; // Display website name or N/A
    },
  },
  {
    accessorKey: "websiteKey",
    header: "Website Key",
    cell: ({ row }: any) => {
      const website = row.original.website;  // Access `website` from the original row object
      return <div className="capitalize">{website?.key || "N/A"}</div>; // Display website key or N/A
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => <div className="capitalize">{row.getValue("email")}</div>,
  },


  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      return (
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
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
              <RiDeleteBin6Line className="text-red-500" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
              <MdOutlineUpdate />
              Edit Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];



function Admin() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [adminData, setAdminData] = useState<any[]>([]); // State to hold admin data
  const [loading, setLoading] = useState<boolean>(false);
  const { user }: any = useUserContext();

  // Function to fetch admin data from API
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-admin`)

      
      if (resp?.status === 200 || resp?.status === 201) {
        setAdminData(resp?.data);
      } else {
        toast.error(resp?.data?.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin data when the component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

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
          {user?.role === userRoles.SUPERADMIN && <AddAdmin />}
        </div>
      </div>

      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-800">
                {headerGroup?.headers?.map((header) => (
                  <TableHead key={header.id} className="bg-gray-800 hover:none text-white text-lg font-bold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-gray-800 hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

export default Admin;
