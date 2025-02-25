"use client"
import * as React from "react"
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { MoreHorizontal, TriangleAlert,Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { userRoles } from "@/constant/user"
import { useUserContext } from "@/context/userContext"
import { usePostContext } from "@/context/postContext"
import { RiDeleteBin6Line } from "react-icons/ri";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import AddCategory from "./component/AddCategory"
import { getURL } from "@/utils/AWS_Config"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosCall from "@/utils/ApiCall"
import { uploadToS3 } from "@/utils/helperFunction"
import { MdOutlineUpdate } from "react-icons/md";
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
    accessorKey: "bannerImageKey",
    header: "Image",
    cell: ({ row }: any) => {
      const imagekey = row.getValue("bannerImageKey");

      return (
        <div className="flex items-center justify-start">
          {imagekey ? (
            <img
              src={getURL(imagekey)}
              // src="/blogImg.png"
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
    header: "Actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const [isOpen, setIsOpen] = useState(false);
      const [category, setCategory] = useState(row.original);
      const { deleteCategory, fetchCategories } = usePostContext();
      const { user, setLoading, websiteKey }: any = useUserContext();


      const handleNonSuperAdminClick = () => {
        toast.error("Only superadmin has permission for this");
      };

      const setImageKey = (key: string) => {
        setCategory({ ...category, bannerImageKey: key });
      }

      const uploadNewFile = async (fileList: FileList | null) => {
        setLoading(true);

        try {
          const payload = {
            folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_CATEGORY,
            fileName: fileList?.[0].name,
            contentType: fileList?.[0].type
          }
          const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload, { websiteKey });

          if (resp.status === 200 || resp.status === 201) {
            uploadToS3(websiteKey, resp?.data?.uploadUrl, fileList?.[0], resp?.data?.key, setLoading, process.env.NEXT_PUBLIC_AWS_FOLDER_CATEGORY, null, setImageKey);
          } else {
            toast.error(resp.data.message, {
              duration: 2000
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      const updateCategory = async (e: any) => {

        if (!category.name.trim() || !category.description.trim()) {
          toast.error("Please fill in all fields correctly.", {
            duration: 2000,
          });
          setLoading(false);
          return;
        }


        e.preventDefault();
        setLoading(true);
        try {
          const payload = {
            name: category.name,
            description: category.description,
            bannerImageKey: category.bannerImageKey
          }
          const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category._id}`, payload, { websiteKey: websiteKey });

          if (resp.status === 200 || resp.status === 201) {
            toast.success(resp.data.message, {
              duration: 2000,
            });
            fetchCategories();
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

      const handleCancel = () => {
        setCategory(row.original);
        setIsOpen(false);
      }

      useEffect(() => {
        setCategory(row.original);
      }, [row.original]);

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialog>
            {
              (user?.role === userRoles.SUPERADMIN || user?.role === userRoles.ADMIN) ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-white bg-black border-[1px] border-gray-800">
                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800" /> */}

                    <AlertDialogTrigger>
                      <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                        <RiDeleteBin6Line className="text-red-500" />
                        Delete category
                      </DropdownMenuItem>
                    </AlertDialogTrigger>



                    <DialogTrigger asChild>
                      <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer px-3">
                        <MdOutlineUpdate />
                        Update category
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
                  Delete Category
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteCategory(category._id)} className='bg-red-500 hover:bg-red-600'>Delete</AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>




          <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className='text-2xl'>Update Category</DialogTitle>
            </DialogHeader>
            <form className="py-4" onSubmit={updateCategory}>
              <div className="mb-4">
                <Label htmlFor="name" className="text-right">
                  Category name
                </Label>
                <Input
                  id="name"
                  value={category.name}
                  placeholder='Enter Name'
                  className=""
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={category.description}
                  placeholder='Enter description'
                  className=""
                  onChange={(e) => setCategory({ ...category, description: e.target.value })}
                  required
                />
              </div>

              <div>
                            <Label className="mb-2 block">Select Image</Label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="img"
                                    onChange={(e: any) => uploadNewFile(e.target.files)}
                                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                                />
                                <div className="border-[1px] border-gray-200 px-4 py-3 rounded-md flex items-center justify-between">
                                    <span className="text-gray-400">Choose file</span>
                                    <Upload className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {category.bannerImageKey && (
                            <div className='w-full max-w-[200px] h-[150px] mx-auto mt-4 rounded-lg overflow-hidden shadow-sm'>
                                <img 
                                    src={getURL(category.bannerImageKey)} 
                                    alt="Banner" 
                                    className='w-full h-full object-cover' 
                                />
                            </div>
                        )}
              <DialogFooter>
                <Button type="button" className='mt-4'onClick={handleCancel}>Cancel</Button>
                <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600 mt-4'>Update</Button>
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


  const [searchQuery, setSearchQuery] = useState('')
  const { categories, fetchCategories, categoryPageNo, setCategoryPageNo }: any = usePostContext()
  const { user, websiteKey }: any = useUserContext();


  const debouncedSetSearchText = debounce((value: string) => {
    setSearchQuery(value);
  }, 900);

  const handleSearch = async (e: any) => {
    const { value } = e.target;
    debouncedSetSearchText(value);
  }


  const table = useReactTable({
    data: categories,
    columns,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
   
    state: {
      sorting,
    
    },
  });


  useEffect(() => {
    if (websiteKey) fetchCategories(searchQuery);
  }, [websiteKey, categoryPageNo]);

  useEffect(() => {
    if (categoryPageNo === 1 && websiteKey) {
      fetchCategories(searchQuery)
    }
    setCategoryPageNo(1)
  }, [searchQuery])



  return (
    <div className="w-full container mx-auto px-4">
      <div className="flex flex-col py-4">
        <div className="flex flex-row items-center justify-between">
          <Input
            placeholder="Search name..."
            onChange={handleSearch}
            className="max-w-sm border-[1px] border-gray-800 text-base"
          />

          {
            (user?.role === userRoles.SUPERADMIN || user?.role === userRoles.ADMIN) &&
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
        <div className="space-x-2 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCategoryPageNo(categoryPageNo - 1)}
            disabled={categoryPageNo <= 1}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{categoryPageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCategoryPageNo(categoryPageNo + 1)}
            disabled={categories.length < 10}
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