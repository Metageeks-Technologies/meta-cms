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
import { ChangePasswordFormType } from '@/types'
import { Eye, EyeOff } from 'lucide-react'

const INITIAL_CHANGE_PASS_FORM_DATA: ChangePasswordFormType = {
    oldPass: "",
    newPass: "",
    confirmNewPass: ""
}



const ChangePassword = () => {

    const [formData, setFormData] = useState<ChangePasswordFormType>(INITIAL_CHANGE_PASS_FORM_DATA)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const { setLoading } = useUserContext();
    const [showOldPass, setShowOldPass] = useState<boolean>(false)
    const [showNewPass, setShowNewPass] = useState<boolean>(false)
    const [showConfirmNewPass, setShowConfirmNewPass] = useState<boolean>(false)


    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.newPass !== formData.confirmNewPass) {
            setError(true);
            return;
        }

        setLoading(true)
        try {
            const payload = {
                oldPassword: formData.oldPass,
                newPassword: formData.newPass
            }
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-password`, payload)

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp.data?.message, { duration: 2000 })
                setIsOpen(false)
            } else {
                toast.error(resp.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in change user password : ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setError(false);
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }))
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={(open) => {
                setFormData(INITIAL_CHANGE_PASS_FORM_DATA)
                setIsOpen(open)
                setError(false)
            }}>
                <DialogTrigger asChild>
                    <Button variant="default" className='bg-green-500 text-white font-bold text-base hover:bg-green-600 py-[21px]'>Change Password</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Change Password</DialogTitle>
                    </DialogHeader>
                    <form className="py-4" onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <Label htmlFor="oldPass" className="text-right">
                                Old Password
                            </Label>

                            <div className='w-full rounded-lg flex flex-row items-center border-[1px] border-gray-100'>
                                <input
                                    id="oldPass"
                                    type={showOldPass ? "text" : "password"}
                                    value={formData.oldPass}
                                    placeholder='Enter password'
                                    className="w-full h-full p-2 border-none outline-none bg-transparent scale-100"
                                    onChange={handleChange}
                                    required
                                />

                                <span onClick={() => setShowOldPass(!showOldPass)} className='pr-3 cursor-pointer'>
                                    {
                                        showOldPass ?
                                            <EyeOff />
                                            : <Eye />
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="newPass" className="text-right">
                                New Password
                            </Label>
                            <div className='w-full rounded-lg flex flex-row items-center border-[1px] border-gray-100'>
                                <input
                                    id="newPass"
                                    type={showNewPass ? "text" : "password"}
                                    value={formData.newPass}
                                    placeholder='Enter password'
                                    className="w-full h-full p-2 border-none outline-none bg-transparent scale-100"
                                    onChange={handleChange}
                                    required
                                />

                                <span onClick={() => setShowNewPass(!showNewPass)} className='pr-3 cursor-pointer'>
                                    {
                                        showNewPass ?
                                            <EyeOff />
                                            : <Eye />
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="confirmNewPass" className="text-right">
                                Confirm New Password
                            </Label>
                            <div className='w-full rounded-lg flex flex-row items-center border-[1px] border-gray-100'>
                                <input
                                    id="confirmNewPass"
                                    type={showConfirmNewPass ? "text" : "password"}
                                    value={formData.confirmNewPass}
                                    placeholder='Enter password'
                                    className="w-full h-full p-2 border-none outline-none bg-transparent scale-100"
                                    onChange={handleChange}
                                    required
                                />

                                <span onClick={() => setShowConfirmNewPass(!showConfirmNewPass)} className='pr-3 cursor-pointer'>
                                    {
                                        showConfirmNewPass ?
                                            <EyeOff />
                                            : <Eye />
                                    }
                                </span>
                            </div>
                        </div>
                        {
                            error &&
                            <p className='text-xs text-red-500 -mt-3'>Password must be same</p>
                        }

                        <DialogFooter>
                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Change Password</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ChangePassword