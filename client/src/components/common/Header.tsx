'use client';
import React from 'react'
import { useSidebar } from "@/components/ui/sidebar"
import { AlignJustify } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from 'next/navigation';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import { INITIAL_USER } from '@/constant/user';
import { headerData } from '@/constant/sidebar';
import { getURL } from '@/utils/AWS_Config';


const Header = () => {

    const { toggleSidebar } = useSidebar();
    const { user, websiteKey, setWebsiteKey, websiteData } = useUserContext();


    const router = useRouter()
    const pathname = usePathname();
    const paramArr = pathname.split('/');
    const param = paramArr[paramArr.length - 1];
    const { setLoading, setUser } = useUserContext();

    const handleLogOut = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`);
            // console.log(resp, "response")

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                setUser(INITIAL_USER);
                router.push('/');
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full h-16 bg-[#06040B] text-gray-200 border-b-[1px] border-gray-800 flex flex-row items-center justify-between sticky top-0 px-2 md:px-8 z-10'>
            <div className='flex flex-row items-center gap-3'>
                <button onClick={toggleSidebar}><AlignJustify /></button>
                <span className='text-white'>
                    {headerData[param as keyof typeof headerData]}
                </span>
            </div>


            <div className='flex items-center gap-4 ml-auto'>
                {/* New Dropdown placed before the account section */}
                {
                    user.role === 'superadmin' && (
                        <div className='relative'>
                            <select
                                className='bg-[#06040B] text-gray-200 border-gray-800 p-2 rounded-md'
                                value={websiteKey}
                                onChange={(e) => setWebsiteKey(e.target.value)}
                            >
                                <option value="" disabled selected>--Choose Website--</option>
                                {
                                    websiteData?.map((data: any, index: number) => (
                                        <option key={index} value={data?.key}>{data?.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    )
                }

                {/* Account Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user?.imageKey ? getURL(user?.imageKey) : "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-[#06040B] text-gray-200 border-gray-800 -translate-x-2 md:-translate-x-8'>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className='bg-gray-800' />
                        <DropdownMenuItem onClick={() => router.push('/profile')} className='cursor-pointer'>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogOut} className='cursor-pointer'>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

    )
}

export default Header