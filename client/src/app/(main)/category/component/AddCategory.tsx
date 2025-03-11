'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import axiosCall from '@/utils/ApiCall'
import { usePostContext } from '@/context/postContext'
import { useUserContext } from '@/context/userContext'
import { uploadToS3 } from '@/utils/helperFunction'
import { getURL } from '@/utils/AWS_Config'
import axios from 'axios'
import { Upload } from 'lucide-react'
import Image from 'next/image';



const AddCategory = () => {

    const { websiteKey } = useUserContext();

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        description: '',
        bannerImageKey: '',
    });

    const setImageKey = (key: string) => {
        setCreateForm({ ...createForm, bannerImageKey: key });
    }

    const [isOpen, setIsOpen] = useState(false);

    const { fetchCategories } = usePostContext();
    const { setLoading } = useUserContext();

    const handleCreateCategory = async (e: any) => {
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
            return
        }

        if (!createForm.bannerImageKey) {
            toast.error('Image is required', {
                duration: 2000,
            });
            return
        }

        setLoading(true);
        try {
            const payload = {
                name: createForm.name,
                description: createForm.description,
                bannerImageKey: createForm.bannerImageKey
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`, payload, { websiteKey });

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                setCreateForm({
                    name: '',
                    description: '',
                    bannerImageKey: null,
                });
                fetchCategories();
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
        if (!fileList?.length) return;

        setLoading(true);
        try {
            const newFiles = Array.from(fileList);

            // Loop through each file and upload it
            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];

                const payload = {
                    folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PRODUCTCATEGORY,
                    fileName: file.name,
                    contentType: file.type,
                };

                const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload, { websiteKey });

                if (resp.status === 200 || resp.status === 201) {
                    const uploadUrl = resp?.data?.uploadUrl;
                    const key = resp?.data?.key;
                    await axios.put(uploadUrl, file);
                    setImageKey(key);
                } else {
                    toast.error(resp.data.message, {
                        duration: 2000,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to upload the file. Please try again.', { duration: 2000 });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Create Category +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Create Category</DialogTitle>
                    </DialogHeader>
                    <form className="py-4" onSubmit={handleCreateCategory}>
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

                        {
                            createForm.bannerImageKey &&
                            <div className='w-[100px] h-[70px]'>
                                <Image
                                    src={getURL(createForm.bannerImageKey)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    layout="responsive" 
                                    width={1200} 
                                    height={500} 
                                />

                            </div>
                        }
                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600 mt-5 '>Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddCategory