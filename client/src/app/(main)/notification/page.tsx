'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Trash2, TriangleAlert } from 'lucide-react';


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const date = new Date();

const data = [
    {
        id: 1,
        name: "Dummy User 1",
        image: "",
        message: "Your account settings have been successfully updated. Please review the changes to ensure everything is correct. If you didn’t make these changes, contact support immediately.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "system"
    },
    {
        id: 2,
        name: "Dummy User 2",
        image: "",
        message: "You received a comment on your recent post. Check it out to engage with your audience!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "comment"
    },
    {
        id: 3,
        name: "Dummy User 3",
        image: "",
        message: "Your subscription will expire soon. Renew now to continue enjoying our services.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "system"
    },
    {
        id: 4,
        name: "Dummy User 4",
        image: "",
        message: "Your profile picture has been updated successfully.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    },
    {
        id: 5,
        name: "Dummy User 5",
        image: "",
        message: "Someone mentioned you in a comment. Check it out!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "comment"
    },
    {
        id: 6,
        name: "Dummy User 6",
        image: "",
        message: "Your password was successfully changed. If you didn’t make this change, contact support immediately.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    },
    {
        id: 7,
        name: "Dummy User 7",
        image: "",
        message: "You have a new follower! Check out their profile now.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "like"
    },
    {
        id: 8,
        name: "Dummy User 8",
        image: "",
        message: "You received a like on your post. See who liked it!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "like"
    },
    {
        id: 9,
        name: "Dummy User 9",
        image: "",
        message: "Your account verification is complete. Welcome aboard!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "system"
    },
    {
        id: 10,
        name: "Dummy User 10",
        image: "",
        message: "Someone commented on your post. Join the conversation!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "comment"
    },
    {
        id: 11,
        name: "Dummy User 11",
        image: "",
        message: "You have a new connection request. Accept or decline.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "like"
    },
    {
        id: 12,
        name: "Dummy User 12",
        image: "",
        message: "You were tagged in a photo. Check it out!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "like"
    },
    {
        id: 13,
        name: "Dummy User 13",
        image: "",
        message: "Your order has been shipped. Track your package now.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    },
    {
        id: 14,
        name: "Dummy User 14",
        image: "",
        message: "Your payment was received. Thank you for your purchase!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    },
    {
        id: 15,
        name: "Dummy User 15",
        image: "",
        message: "You received a reply to your comment. Check it out now!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "comment"
    },
    {
        id: 16,
        name: "Dummy User 16",
        image: "",
        message: "We updated our privacy policy. Review the changes here.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    },
    {
        id: 17,
        name: "Dummy User 17",
        image: "",
        message: "Congratulations! You reached a new milestone on your profile.",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "like"
    },
    {
        id: 18,
        name: "Dummy User 18",
        image: "",
        message: "Someone shared your post. See who shared it!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "like"
    },
    {
        id: 19,
        name: "Dummy User 19",
        image: "",
        message: "You were mentioned in a discussion. Join the thread now!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: false,
        type: "comment"
    },
    {
        id: 20,
        name: "Dummy User 20",
        image: "",
        message: "Your feedback was received. Thank you for helping us improve!",
        date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
        read: true,
        type: "system"
    }
];



const Page = () => {

    const [selectedNotification, setSelectedNotification] = useState('all');

    const [notificationData, setNotificationData] = useState(data.sort((a: any, b: any) => a.read - b.read));


    const handleFilter = (value: string) => {

        if (value === 'all') {
            setNotificationData(data.sort((a: any, b: any) => a.read - b.read));
            setSelectedNotification(value);
            return;;
        }

        if (value === 'read') {
            const filteredData = data.filter((data) => data.read === true);
            setNotificationData(filteredData);
            setSelectedNotification(value);
            return;
        }

        if (value === 'unread') {
            const filteredData = data.filter((data) => data.read === false);
            setNotificationData(filteredData);
            setSelectedNotification(value);
            return;
        }

        if (value === 'like') {
            const filteredData = data.filter((data) => data.type === 'like');
            setNotificationData(filteredData.sort((a: any, b: any) => a.read - b.read));
            setSelectedNotification(value);
            return;
        }

        if (value === 'comment') {
            const filteredData = data.filter((data) => data.type === 'comment');
            setNotificationData(filteredData.sort((a: any, b: any) => a.read - b.read));
            setSelectedNotification(value);
            return;
        }

        if (value === 'system') {
            const filteredData = data.filter((data) => data.type === 'system');
            setNotificationData(filteredData.sort((a: any, b: any) => a.read - b.read));
            setSelectedNotification(value);
            return;
        }
    }

    const handleDelete = (id: number) => {
        const newData = notificationData.filter((data) => data.id !== id);
        setNotificationData(newData);
    }




    return (
        <div className='w-full h-auto text-gray-200 px-2 xl:px-10 py-6 flex flex-col-reverse'>
            <div className='w-full sm:w-[60%] md:w-[55%] lg:w-[60%] xl:w-[70%]'>
                {
                    notificationData.map((data, index) => (
                        <div key={data.id} className={`mx-auto my-2 p-2 md:p-4 border-b-[1px] border-gray-800 rounded-lg ${data.read ? "" : "bg-gray-900"}`}>
                            <div className='flex flex-row items-center gap-5 justify-between'>

                                <div className='flex flex-row items-center gap-2'>
                                    <Avatar>
                                        <AvatarImage src={data.image ? data.image : "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='text-sm md:text-base'>Notification from {data.name}</p>
                                        <p className='text-xs text-gray-400'>{data.date}</p>
                                    </div>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Trash2 className='w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer' />
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className=''>

                                        <AlertDialogHeader>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription className='h-28' >
                                                <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
                                            </AlertDialogDescription>
                                            <AlertDialogDescription className='w-full text-center'>
                                                This action cannot be undone. It will permanently delete your notification and all related data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(data.id)} className='bg-red-500 hover:bg-red-600'>Delete</AlertDialogAction>
                                        </AlertDialogFooter>

                                    </AlertDialogContent>
                                </AlertDialog>


                            </div>

                            <div className='text-gray-400 text-xs md:text-sm my-2'>
                                <p>{data.message}</p>
                            </div>
                        </div>
                    ))
                }

            </div>

            {/* menu bar for screen greater then sm: */}

            <div className='hidden sm:block w-[35%] md:w-[28%] lg:w-[25%] xl:w-[20%] fixed top-24 bottom-8 right-2 xl:right-10 bg-gray-900 rounded-lg px-5 py-10'>
                <h2 className='text-2xl mb-4 font-semibold'>Notification</h2>
                <ul className='flex flex-col gap-1'>
                    <li onClick={() => handleFilter('all')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'all' ? "bg-gray-800" : ""}`}>All</li>
                    <li onClick={() => handleFilter('unread')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'unread' ? "bg-gray-800" : ""}`}>Unread</li>
                    <li onClick={() => handleFilter('read')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'read' ? "bg-gray-800" : ""}`}>Read</li>
                    <li onClick={() => handleFilter('like')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'like' ? "bg-gray-800" : ""}`}>Likes</li>
                    <li onClick={() => handleFilter('comment')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'comment' ? "bg-gray-800" : ""}`}>Comments</li>
                    <li onClick={() => handleFilter('system')} className={`px-5 py-4 font-semibold hover:bg-gray-800 rounded-lg cursor-pointer ${selectedNotification === 'system' ? "bg-gray-800" : ""}`}>System</li>
                </ul>
            </div>


            {/* menu bar for screen less then sm: */}

            <div className='block sm:hidden my-2 mb-4'>
                <ul className='flex flex-row flex-wrap gap-1'>

                    <li onClick={() => handleFilter('all')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'all' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'all' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>All</span>
                    </li>
                    <li onClick={() => handleFilter('unread')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'unread' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'unread' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>Unread</span>
                    </li>
                    <li onClick={() => handleFilter('read')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'read' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'read' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>Read</span>
                    </li>
                    <li onClick={() => handleFilter('like')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'like' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'like' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>Likes</span>
                    </li>
                    <li onClick={() => handleFilter('comment')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'comment' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'comment' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>Comments</span>
                    </li>

                    <li onClick={() => handleFilter('system')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${selectedNotification == 'system' ? "text-blue-800 border-blue-800" : ""}`}>
                        {
                            selectedNotification === 'system' ?
                                <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                : null
                        }
                        <span>System</span>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default Page