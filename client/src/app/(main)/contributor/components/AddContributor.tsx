'use client'
import React, { useEffect, useState } from 'react'
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
import { PremissionEnum } from '@/constant/admin'
import axios from 'axios';
import toast from 'react-hot-toast'
import axiosCall from '@/utils/ApiCall'
import { useUserContext } from '@/context/userContext'
import { userRoles } from '@/constant/user'
import { permission } from 'process'



const AddContributor = () => {

    const { loading, setLoading, user, fetchUsers, websiteKey } = useUserContext();
   

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        email: '',
        password: '',
        role: userRoles.CONTRIBUTOR,
        websiteName: user?.website?.name,
        permissions: user?.website?.permissions,
    });
 
    const [isOpen, setIsOpen] = useState(false);

    const handleCreateContributor = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!createForm.name.trim()) {
            toast.error('Name is required', { duration: 2000 });
            return;
        }

        if (!createForm.email.trim()) {
            toast.error('Email is required', { duration: 2000 });
            return;
        }

        if (!createForm.password.trim()) {
            toast.error('Password is required', { duration: 2000 });
            return;
        }


        if (!Array.isArray(createForm.permissions) || createForm.permissions.length === 0) {
            toast.error('Permissions should not be empty and must be an array of strings', { duration: 2000 });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...createForm }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/users/create`, payload, { websiteKey: websiteKey });

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success('Moderator created successfully!', { duration: 2000 });
                setCreateForm({
                    name: '',
                    email: '',
                    role: userRoles.MODERATOR,
                    password: '',
                    websiteName: '',
                    permissions: [],
                });
                fetchUsers(userRoles.CONTRIBUTOR);
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

    useEffect(() => {
        setCreateForm({
            name: '',
            email: '',
            password: '',
            role: userRoles.CONTRIBUTOR,
            websiteName: user?.website?.name,
            permissions: user?.website?.permissions,
        })
    }, [user]);



    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add Contributor +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[450px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Add Contributor</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateContributor} className="py-4">
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
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={createForm.email}
                                placeholder='Enter email'
                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                value={createForm.password}
                                placeholder='Enter password'
                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
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

export default AddContributor