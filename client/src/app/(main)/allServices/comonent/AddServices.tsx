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
import { usePageContext } from '@/context/pageContext'

const AddServices = () => {

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        description: '',

    });
    const { loading, setLoading, websiteKey } = useUserContext();
    const { fetchServices } = usePageContext();
    const [isOpen, setIsOpen] = useState(false)



    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.name.trim()) {
            toast.error('Name is required', { duration: 2000 });
            return;
        }
        if (!createForm.description.trim()) {
            toast.error('Email is required', { duration: 2000 });
            return;
        }
        setLoading(true); 
        try {
            const payload = {
                name: createForm.name,
                description: createForm.description,
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/services`, payload, { websiteKey: websiteKey });

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success('Services created successfully!', { duration: 2000 });
                setCreateForm({
                    name: '',
                    description: '',
                });
                fetchServices();
                setIsOpen(false);
            } else {
                toast.error(resp?.data?.message || 'Error creating admin', { duration: 2000 });
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Error creating admin. Please try again.', { duration: 2000 });
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add Services +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Add Services</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="py-4">
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={createForm.name}
                                placeholder='Enter Name'
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
                                placeholder='Enter email'
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600' disabled={loading}>
                                {loading ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default AddServices;
