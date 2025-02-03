'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import axiosCall from '@/utils/ApiCall'
import { usePostContext } from '@/context/postContext'
import { useUserContext } from '@/context/userContext'
import { uploadToS3 } from '@/utils/helperFunction'
import { getURL } from '@/utils/AWS_Config'

const AddProductCategory = ({ categoryToUpdate = null }: any) => {

    const [createForm, setCreateForm] = useState<any>({
        name:  '',
        description:  '',
        bannerImageKey: '',
    });

    const setImageKey = (key: string) => {
        setCreateForm({ ...createForm, bannerImageKey: key });
    }

    const [isOpen, setIsOpen] = useState(false);

    const { fetchProductCategories } = usePostContext();
    const { setLoading } = useUserContext();

    const handleCreateOrUpdateCategory = async (e: any) => {
        e.preventDefault();

        if (!createForm.name.trim()) {
            toast.error('Name is required', {
                duration: 2000,
            });
            return;
        }

        if (!createForm.description.trim()) {
            toast.error('Description is required', {
                duration: 2000,
            });
            return;
        }

        if (!createForm.bannerImageKey) {
            toast.error('Image is required', {
                duration: 2000,
            });
            return;
        }

        if (!createForm.code.trim()) {
            toast.error('Code is required', {
                duration: 2000,
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: createForm.name,
                description: createForm.description,
                bannerImageKey: createForm.bannerImageKey,
                code: createForm.code, 
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories`, payload);


            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                setCreateForm({
                    name: '',
                    description: '',
                    bannerImageKey: null,
                    code: '', // reset code
                });
                fetchProductCategories();
                setIsOpen(false);
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
    }

    const uploadNewFile = async (fileList: FileList | null) => {
        setLoading(true);
        try {
            const payload = {
                folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PRODUCTCATEGORY,
                fileName: fileList?.[0].name,
                contentType: fileList?.[0].type
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);

            if (resp.status === 200 || resp.status === 201) {
                uploadToS3(resp?.data?.uploadUrl, fileList?.[0], resp?.data?.key, setLoading, process.env.NEXT_PUBLIC_AWS_FOLDER_CATEGORY, null, setImageKey);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>
                        {categoryToUpdate ? 'Update Category' : 'Create Category'} +
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{categoryToUpdate ? 'Update Category' : 'Create Category'}</DialogTitle>
                    </DialogHeader>
                    <form className="py-4" onSubmit={handleCreateOrUpdateCategory}>
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-right">
                                Category name
                            </Label>
                            <Input
                                id="name"
                                value={createForm.name}
                                placeholder='Enter Name'
                                className=""
                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={createForm.description}
                                placeholder='Enter description'
                                className=""
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                required
                            />
                        </div>
                        {/* <div className="mb-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                value={createForm.code}
                                placeholder='Enter category code'
                                className=""
                                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                                required
                            />
                        </div> */}

                        <div className="w-full mb-4 border-[1px] border-gray-200 px-4 py-[5px] rounded-md">
                            <Label htmlFor="img" className="text-right w-full ">
                                Select Image
                            </Label>
                            <input
                                type="file"
                                id="img"
                                onChange={(e: any) => uploadNewFile(e.target.files)}
                                className='hidden'
                            />
                        </div>

                        {
                            createForm.bannerImageKey &&
                            <div className='w-[100px] h-[70px]'>
                                <img src={getURL(createForm.bannerImageKey)} alt="" className='w-full h-full object-cover' />
                            </div>
                        }
                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>{categoryToUpdate ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddProductCategory
