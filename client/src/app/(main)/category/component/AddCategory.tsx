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


const AddCategory = () => {

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        description: '',
        bannerImageKey: null,
    });

    const [isOpen, setIsOpen] = useState(false);

    const {fetchCategories} = usePostContext();
    const {setLoading} = useUserContext();

    const handleCreateCategory = async (e: any) => {
        e.preventDefault();
        if (!createForm.name) {
            toast.error('Name is required', {
                duration: 2000,
            });
            return
        }

        if (!createForm.description) {
            toast.error('Description is required', {
                duration: 2000,
            });
            return
        }

        try {
            setLoading(true);
            const payload = {
                name: createForm.name,
                description: createForm.description,
                bannerImageKey: "/banner/key"
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`, payload);

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
                setLoading(false);
            } else {
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


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

                        <div className="mb-4">
                            <Label htmlFor="img" className="text-right">
                                Image
                            </Label>
                            <Input
                                type='file'
                                id="img"
                                // value={createForm.bannerImageKey}
                                placeholder='Enter description'
                                className="text-white"
                            // onChange={(e) => setCreateForm({ ...createForm, bannerImageKey: e.target.files[0] })}
                            // required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddCategory