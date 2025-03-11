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
import { useWebsiteContext } from '@/context/websiteContext'


const AddWebsite = () => {

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        key: '',
    });

    const [isOpen, setIsOpen] = useState(false);
    const { fetchWebsiteData } = useWebsiteContext();
    const { setLoading } = useUserContext();

    const handleAddWebsite = async (e: any) => {
        e.preventDefault();
        if (!createForm.name.trim()) {
            toast.error('Name is required', {
                duration: 2000,
            });
            return;
        }

        if (!createForm.key.trim()) {
            toast.error('Key is required', {
                duration: 2000,
            });
            return
        }

        setLoading(true);
        try {
            const payload = {
                name: createForm.name,
                key: createForm.key
            }
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/website`, payload);

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                setCreateForm({
                    name: '',
                    key: "",
                });
                fetchWebsiteData();
                setIsOpen(false);
            } else {
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log("Error in add new website : ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add Website +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Add Website</DialogTitle>
                    </DialogHeader>
                    <form className="py-4" onSubmit={handleAddWebsite}>
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-right">
                                Name
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
                                Key
                            </Label>
                            <Input
                                id="key"
                                value={createForm.key}
                                placeholder='Enter key'
                                className=""
                                onChange={(e) => setCreateForm({ ...createForm, key: e.target.value })}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddWebsite