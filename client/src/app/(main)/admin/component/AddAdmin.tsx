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
import axios from 'axios';
import toast from 'react-hot-toast'
import axiosCall from '@/utils/ApiCall'
import { PermissionEnum } from '@/constant/sidebar'

const AddAdmin = () => {

    const [createForm, setCreateForm] = useState<any>({
        name: '',
        email: '',
        websiteName: '',
        permissions: [],  
        password: ''
    });

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
      const [adminData, setAdminData] = useState<any[]>([]); // State to hold admin data
    

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setCreateForm((prevForm: any) => {
            const updatedPermissions = checked
                ? [...prevForm.permissions, value] 
                : prevForm.permissions.filter((perm: string) => perm !== value); 
            return { ...prevForm, permissions: updatedPermissions }; 
        });
    }

    const fetchAdmins = async () => {
        setLoading(true);
        try {
          const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-admin`)

          
          if (resp?.status === 200 || resp?.status === 201) {
            setAdminData(resp?.data);
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
      };

    const handleCreateAdmin = async (e: React.FormEvent) => {
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

        setLoading(true); // Show loading state
        try {
            const payload = {
                name: createForm.name,
                email: createForm.email,
                websiteName: createForm.websiteName,
                permissions: createForm.permissions,  
                password: createForm.password
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/users/create/admin`, payload);

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success('Admin created successfully!', { duration: 2000 });
                setCreateForm({
                    name: '',
                    email: '',
                    websiteName: '',
                    permissions: [], 
                    password: ''
                });
                fetchAdmins();
                setIsOpen(false);
            } else {
                toast.error(resp?.data?.message || 'Error creating admin', { duration: 2000 });
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Error creating admin. Please try again.', { duration: 2000 });
        } finally {
            setLoading(false); // Hide loading state
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add Admin +</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Add Admin</DialogTitle>
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
                            <Label htmlFor="website" className="text-right">
                                Website
                            </Label>
                            <Input
                                id="website"
                                value={createForm.websiteName}
                                placeholder='Enter website'
                                onChange={(e) => setCreateForm({ ...createForm, websiteName: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <Label className="text-right">Permissions</Label>
                            <div className="flex flex-wrap gap-4"> {/* Flexbox for horizontal layout */}
                                {Object.values(PermissionEnum).map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={permission}
                                            value={permission}
                                            checked={createForm.permissions.includes(permission)}  
                                            onChange={handlePermissionChange}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor={permission} className="text-right">
                                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
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

export default AddAdmin;
