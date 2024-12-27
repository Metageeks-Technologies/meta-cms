'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { SetStateAction, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PostTypes } from '@/types'
import { blogPosts } from '@/constant/post'
import axiosCall from '@/utils/ApiCall'
import { handleDate } from '@/utils/helperFunction'
import toast from 'react-hot-toast'
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
import { Button } from "@/components/ui/button"




const page = () => {
    useAuth();

    const [post, setPost] = useState<PostTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();
    const slug = params.id;

    const [userRole, setUserRole] = useState<any>();

    useEffect(() => {
        const userString = localStorage.getItem("user");

        if (userString) {
            const role = JSON.parse(userString).role;
            setUserRole(role);

        } else {
            console.log("No user data found in localStorage.");
        }
    }, [])



    const fetchPost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`);
            if (resp) {
                setPost(resp);
                setLoading(false);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPost();
    }, []);

    const handleRejectPost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/reject`);

            if (resp) {
                toast.success("Post Rejected", {
                    duration: 2000,
                })
                fetchPost();
                setLoading(false);
            }
        } catch (error) {

        }
    }

    const handleApprovePost = async () => {
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/approve`);

            if (resp) {
                toast.success("Post Approved", {
                    duration: 2000,
                })
                fetchPost();
                setLoading(false);
            }
        } catch (error) {

        }
    }


    const handleDeletePost = async () => {
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}}`);

            if (resp?.message === "Post deleted successfully") {
                toast.error(resp?.message, {
                    duration: 2000,
                });
                router.back();
            } else {
                toast.error(resp?.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRecovePost = async () => {
        try {
            
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/recover}`);

            if (resp?.message === "Post recovered successfully") {
                toast.error(resp?.message, {
                    duration: 2000,
                });
                fetchPost();
            } else {
                toast.error(resp?.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='w-full text-gray-200 p-3 sm:p-8 flex flex-col items-start'>
            <div className='rotate-180 my-3'>
                <ArrowRight className='w-5 sm:w-8 h-4 sm:h-8 cursor-pointer' onClick={() => router.back()} />
            </div>

            {
                !loading ?
                    <div className='w-full md:w-[800px] mx-auto '>
                        {
                            post?.title ?
                                <div className='flex flex-col gap-5'>
                                    <h1 className='text-2xl sm:text-3xl md:text-5xl mb-2 sm:mb-4 font-bold'>{post?.title}</h1>
                                    {/* <img src={post?.previewImageKey ? post.previewImageKey : "/blogImg.png"} className='w-full object-contain' /> */}
                                    <img src={"/blogImg.png"} className='w-full object-contain' />
                                    <div dangerouslySetInnerHTML={{ __html: post?.description }}></div>
                                    <div className='w-full flex flex-row justify-end gap-2'>
                                        <p>Author : {post?.author.name}</p> |
                                        <p>Date : {handleDate(post?.publishedDate)}</p>
                                    </div>

                                    {
                                        ((userRole === "superadmin" || userRole === "moderator") && post.status === "awaiting approval") &&
                                        <div className='w-full flex flex-row gap-3 mt-5'>
                                            <button onClick={handleRejectPost} className='w-full bg-red-200 border-[2px] border-red-600 text-red-600 font-bold p-2 rounded-lg text-base'>Reject</button>
                                            <button onClick={handleApprovePost} className='w-full bg-green-200 border-[2px] border-green-600 text-green-600 font-bold p-2 rounded-lg text-base'>Approve</button>
                                        </div>
                                    }

                                    {
                                        !post.isDeleted &&

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className='bg-red-500 max-w-min text-white px-6 py-3 text-base rounded-lg font-bold hover:bg-red-700'>Delete Post</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-black text-white border-none">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-center my-5 text-xl">Are you absolutely sure?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="text-white bg-black">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeletePost} className="text-white bg-red-500 hover:bg-red-700">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    }

                                    {
                                        post.isDeleted && userRole === 'superadmin' &&

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className='bg-green-500 max-w-min text-white px-6 py-3 text-base rounded-lg font-bold hover:bg-green-700'>Recover Post</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-black text-white border-none">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-center my-5 text-xl">Are you absolutely sure?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="text-white bg-black">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleRecovePost} className="text-white bg-green-500 hover:bg-green-700">Recover</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    }

                                   

                                </div>
                                : <p className='text-center text-2xl'>No Data found.</p>
                        }
                    </div>
                    : <p className='text-center mx-auto text-xl'>Loading...</p>
            }
        </div>
    )
}

export default page