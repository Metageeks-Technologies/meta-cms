'use client';
import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosCall from "@/utils/ApiCall"; 
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<string>("");

  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all'); // Track selected status
  const [activeButton, setActiveButton] = useState<string>('all'); // Track active button for styling

  // Fetch products based on the current status
  const fetchProducts = async (status: string = 'all') => {
    setLoading(true);
    let endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/products/all`; // Default endpoint

    if (status === 'all') {
      endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/products/all`;
    } else if (status === 'deleted') {
      endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/products/all/delete`;
    } else {
      // Handle spaces in status like 'awaiting approval'
      const statusParam = status.replace(' ', '%20'); // Encode spaces
      endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/products/all?status=${statusParam}`;
    }

    try {
      const response = await axiosCall('GET', endpoint);

      if (response.status === 200 || response.status === 201) {
        setProducts(response.data);
      } else {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching products.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(statusFilter); // Fetch products based on the selected status
  }, [statusFilter]);

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "subDescription",
      header: "Sub Description",
      cell: ({ row }: any) => (
        <div>{row.getValue("subDescription")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: any) => {
        const category = row.getValue("category");
        return <div>{category?.name || category}</div>;
      },
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }: any) => {
        const brand = row.getValue("brand");
        return <div>{brand?.name || brand}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <div>{row.getValue("status")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-gray-600 hover:underline">
                <MoreHorizontal />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-white bg-black border-gray-800">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={() => handleEdit(product)} className="hover:bg-gray-800 cursor-pointer px-3">
                <AiOutlineEdit className="mr-1" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePreview(product)} className="hover:bg-gray-800 cursor-pointer px-3">
                <AiOutlineEye className="mr-1" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product)} className="hover:bg-gray-800 cursor-pointer px-3">
                <RiDeleteBin6Line className="mr-1" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (product: any) => {
    if (product._id) {
      router.push(`/store/editProduct/${product._id}`);
    } else {
      toast.error("Product ID not found.");
    }
  };

  const handlePreview = (product: any) => {
    if (product._id) {
      router.push(`/store/product/${product._id}`);
    } else {
      toast.error("Product ID not found.");
    }
  };

  const handleDelete = async (product: any) => {
    setLoading(true);
    try {
      const response = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/products/delete/${product._id}`);
      if (response.status === 200 || response.status === 204) {
        toast.success(response?.data?.message, { duration: 2000 });
        fetchProducts(statusFilter); // Refetch products after delete
      } else {
        toast.error(response?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error deleting product.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full container mx-auto px-4">
      {/* Status Filter Buttons */}
      <div className="flex space-x-4 py-4">
        <Button 
          onClick={() => {
            setStatusFilter('all');
            setActiveButton('all');
          }} 
          className={`font-bold ${activeButton === 'all' ? 'bg-gray-800 text-white' : ''}`}
        >
          All
        </Button>
        <Button 
          onClick={() => {
            setStatusFilter('published');
            setActiveButton('published');
          }} 
          className={`font-bold ${activeButton === 'published' ? 'bg-gray-800 text-white' : ''}`}
        >
          Published
        </Button>
        <Button 
          onClick={() => {
            setStatusFilter('awaiting approval');
            setActiveButton('awaiting approval');
          }} 
          className={`font-bold ${activeButton === 'awaiting approval' ? 'bg-gray-800 text-white' : ''}`}
        >
          Awaiting Approval
        </Button>
        <Button 
          onClick={() => {
            setStatusFilter('draft');
            setActiveButton('draft');
          }} 
          className={`font-bold ${activeButton === 'draft' ? 'bg-gray-800 text-white' : ''}`}
        >
          Draft
        </Button>
        <Button 
          onClick={() => {
            setStatusFilter('rejected');
            setActiveButton('rejected');
          }} 
          className={`font-bold ${activeButton === 'rejected' ? 'bg-gray-800 text-white' : ''}`}
        >
          Rejected
        </Button>
        <Button 
          onClick={() => {
            setStatusFilter('deleted');
            setActiveButton('deleted');
          }} 
          className={`font-bold ${activeButton === 'deleted' ? 'bg-gray-800 text-white' : ''}`}
        >
          Deleted
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col py-4">
        <Input
          placeholder="Search title..."
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            table.getColumn("title")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm border-[1px] border-gray-800 text-base"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-gray-800 hover:none text-white text-lg font-bold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-gray-800 hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {!loading ? table.getFilteredRowModel().rows.length : 0} rows.
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
};

export default ProductTable;
