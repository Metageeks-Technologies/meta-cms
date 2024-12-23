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
import { usePathname } from 'next/navigation';





const Header = () => {

    const { toggleSidebar } = useSidebar();

    const pathname = usePathname();

    return (
        <div className='w-full h-16 bg-[#06040B] text-gray-200 border-b-[1px] border-gray-800 flex flex-row items-center justify-between sticky top-0 px-2 md:px-8 z-10'>
            <div className='flex flex-row items-center gap-3'>
                <button onClick={toggleSidebar}><AlignJustify /></button>
                <span className='text-white'>
                    {
                        pathname.split('/')[1] ?
                            pathname.split('/')[1] === 'allPost' ? "All Post" :
                                pathname.split('/')[1] === 'newPost' ? "New Post" :
                                    pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1)
                            : "Dashboard"}
                </span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-[#06040B] text-gray-200 border-gray-800 -translate-x-2 md:-translate-x-8'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-gray-800' />
                    <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    )
}

export default Header