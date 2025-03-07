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
import { useUserContext } from '@/context/userContext'

const AddNewSubService = ({ fetchSubServices, serviceId }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const { websiteKey, user, setLoading } = useUserContext();

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        description: '',
    });


    const handleSubmit = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        
        setLoading(true);
        try {
            const payload = { ...createForm }

            payload['service'] = serviceId;

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices`, payload, { websiteKey: websiteKey });

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success('Subservice add successfully!', { duration: 2000 });
                fetchSubServices();
                setCreateForm({
                    name: '',
                    description: '',
                });
                setIsOpen(false);
            } else {
                toast.error(resp?.data?.message || 'Error in add new sub service', { duration: 2000 });
            }
        } catch (error) {
            console.log("Error in creating sub service : ", error);
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='text-nowrap bg-blue-600 hover:bg-blue-700 py-5 px-2 rounded-lg'>Add new </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Create Sub Service</DialogTitle>
                    </DialogHeader>
                    <form className="py-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-right">
                                Subservice name
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

                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewSubService