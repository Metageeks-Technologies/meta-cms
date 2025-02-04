import React, { useEffect, useState } from 'react'
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
import { Button } from "@/components/ui/button"
import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall'
import toast from 'react-hot-toast'
import { getURL } from '@/utils/AWS_Config'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddressCompoent from './AddressCompoent'
import OrderComponent from './OrderComponent'




const UserDetails = ({ user, setIsOpen }: any) => {



    const [tab, setTab] = useState(1);


    return (
        <DialogContent className="sm:max-w-[600px] bg-black border-gray-800 text-white">
            <DialogHeader>
                <DialogTitle className='text-2xl'>User Dertail</DialogTitle>
            </DialogHeader>

            <div>
                <div className='flex flex-row gap-5 items-start w-full bg-gray-900 rounded-lg p-4'>
                    <Avatar className='w-14 h-14'>
                        <AvatarImage src={user?.imageKey ? getURL(user?.imageKey) : "https://github.com/shadcn.png"} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div>
                        <p className='text-lg font-bold'>{user?.name}</p>
                        <p className='text-gray-400'>{user?.bio ?? "Bio"}</p>
                    </div>
                </div>

                <div>
                    <div className='flex flex-row gap-5 my-5'>
                        <button type='button' onClick={() => setTab(1)} className={`font-bold px-5 py-2 cursor-pointer ${tab === 1 ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}>Address</button>
                        <button type='button' onClick={() => setTab(2)} className={`font-bold px-5 py-2 cursor-pointer ${tab === 2 ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}>Orders</button>
                    </div>

                    {
                        tab === 1 ?
                            <AddressCompoent user={user}/>
                            : tab === 2 ?
                                <OrderComponent user={user}/>
                                : null
                    }
                </div>
            </div>

        </DialogContent>
    )
}

export default UserDetails