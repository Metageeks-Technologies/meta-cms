'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {   Dialog,  DialogContent,  DialogFooter,  DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import axiosCall from '@/utils/ApiCall'
import { useUserContext } from '@/context/userContext'
import { usePageContext } from '@/context/pageContext'

const AddSubServices = () => {

    const [createForm, setCreateForm] = useState<any>({
        service: '',
        name: '',
        description: '',
    });

    const { loading, setLoading, websiteKey } = useUserContext();
    const { fetchSubServices, services, fetchServices } = usePageContext();
    const [isOpen, setIsOpen] = useState(false);
    const [servicesFetched, setServicesFetched] = useState(false); 
    useEffect(() => {
        if (websiteKey && !servicesFetched) {
            fetchServices();  
            setServicesFetched(true);  
        }
    }, [fetchServices, servicesFetched, websiteKey]);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.name.trim()) {
            toast.error('Name is required', { duration: 2000 });
            return;
        }
        if (!createForm.description.trim()) {
            toast.error('Description is required', { duration: 2000 });
            return;
        }
       if (!createForm.service) {
            toast.error('Please select a service', { duration: 2000 });
            return;
        }

        setLoading(true); 
        try {
            const payload = {
                name: createForm.name,
                description: createForm.description,
                service: createForm.service
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices`, payload, { websiteKey: websiteKey });

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success('Subservice created successfully!', { duration: 2000 });
                setCreateForm({
                    service: '',
                    name: '',
                    description: '',
                });
                fetchSubServices(createForm.service); 
                setIsOpen(false);
            } else {
                toast.error(resp?.data?.message || 'Error creating subservice', { duration: 2000 });
            }
        } catch (error) {
            console.error('Error creating subservice:', error);
            toast.error('Error creating subservice. Please try again.', { duration: 2000 });
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add SubServices +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Add SubServices</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="py-4">
                        <div className="mb-4 ">
                            <Label htmlFor="service" className="text-right text-2xl mx-auto mr-6">
                                Services
                            </Label>
                            <select
                                id="service"
                                className='bg-[#06040B] text-gray-200 border-gray-800 p-2 rounded-md'
                                value={createForm.service}
                                onChange={(e) => setCreateForm({ ...createForm, service: e.target.value })}
                            >
                                <option value="">--Choose Service--</option>
                                {
                                    services?.map((data: any, index: number) => (
                                        <option key={index} value={data?._id}>{data?.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-right">
                                SubService Name
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
                                placeholder='Enter description'
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

export default AddSubServices;
