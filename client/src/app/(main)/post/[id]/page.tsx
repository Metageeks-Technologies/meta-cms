'use client'
import { useParams, useRouter } from 'next/navigation'

import React, { useContext, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PostTypes } from '@/types'
import { postStatuEnum } from '@/constant/post'
import axiosCall from '@/utils/ApiCall'
import { handleDate } from '@/utils/helperFunction'
import toast from 'react-hot-toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { userRoles } from '@/constant/user'
import { useUserContext } from '@/context/userContext'
import { getURL } from '@/utils/AWS_Config'
import { IComment } from '@/types'


const page = () => {
    const { setLoading, user } = useUserContext();
    const [post, setPost] = useState<PostTypes | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [lastId, setLastId] = useState<string>('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);


    const [comments, setComments] = useState<IComment[]>([])

    const router = useRouter();
    const params = useParams();
    const slug = params.id;



    const fetchPost = async () => {
        setLoading(true);
        setIsLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`);
            if (resp.status === 200 || resp.status === 201) {
                setPost(resp.data);
                if (resp.data?._id) {
                    await fetchComments(resp.data._id);
                }
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error("Failed to fetch post.", { duration: 2000 });
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    const fetchComments = async (postId: string, lastId?: string) => {
        if (!postId || isFetching) return;
    
        setIsFetching(true);
        try {
            const param = new URLSearchParams();
            if (lastId) param.append('lastId', lastId);
            param.append('page', String(page));
    
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/public/comment/${postId}?${param.toString()}`);
    
            if (resp.status === 200 || resp.status === 201) {
                const newComments = resp.data;
    
                // Filter out duplicate comments
                const uniqueComments = [...new Map([...comments, ...newComments].map(comment => [comment._id, comment])).values()];
    
                setComments(uniqueComments);
    
                if (newComments.length < 5) {
                    setHasMore(false);
                }
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error("Failed to fetch comments.", { duration: 2000 });
        } finally {
            setIsFetching(false);
        }
    };
    



    const handleDeleteComment = async (commentId: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${post?._id}/delete/${commentId}`);
    
            if (resp.status === 200 || resp.status === 201) {
                toast.success("Comment Deleted", { duration: 2000 });
                // Remove the deleted comment from state
                setComments((prev) => {
                    // Update the post's comment count
                    setPost((prevPost:any) => ({
                        ...prevPost,
                        commentCount: prevPost.commentCount > 0 ? prevPost.commentCount - 1 : 0
                    }));
                    return prev.filter(comment => comment._id !== commentId);
                });
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error("Failed to delete comment.", { duration: 2000 });
        } finally {
            setLoading(false);
        }
    };
    
    


    const handleRejectPost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/reject`);

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Rejected", {
                    duration: 2000,
                })
                fetchPost();
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleApprovePost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/approve`);

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Approved", {
                    duration: 2000,
                })
                fetchPost();
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    const handleDeletePost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}`);

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                router.back();
            } else {
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const handleRecovePost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/recover`);

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data.message, {
                    duration: 2000,
                });
                fetchPost();
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const handlePublished = async (id: string) => {
        setLoading(true);
        try {
            const payload = {
                status: postStatuEnum.PUBLISHED,
            }
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`, payload);

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Published", { duration: 2000 });
                fetchPost();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.role) {
            fetchPost();
        }
    }, [user]);

    useEffect(() => {
        setLastId(comments[comments.length - 1]?._id || '');
    }, [comments]);
    


    return (
        <div className='w-full text-gray-200 p-3 sm:p-8 flex flex-col items-start'>
            <div className='rotate-180 my-3'>
                <ArrowRight className='w-5 sm:w-8 h-4 sm:h-8 cursor-pointer' onClick={() => router.back()} />
            </div>

            {
                !isLoading ?
                    <div className='w-full md:w-[800px] mx-auto '>
                        {
                            post?.title ?
                                <div className='flex flex-col gap-5'>
                                    <h1 className='text-2xl sm:text-3xl md:text-5xl mb-2 sm:mb-4 font-bold'>{post?.title}</h1>
                                    <img src={getURL(post?.previewImageKey)} className='w-full object-contain' />
                                    {/* <img src={"/blogImg.png"} className='w-full object-contain' /> */}
                                    <div className="tinymce-content" dangerouslySetInnerHTML={{ __html: post?.description }}></div>
                                    <div className='w-full flex flex-row justify-end gap-2'>
                                        <p>Author : {post?.author.name}</p> |
                                        <p>Date : {handleDate(post?.publishedDate)}</p>
                                    </div>


                                    {
                                        ((user?.role === userRoles.SUPERADMIN || user?.role === userRoles.MODERATOR) && post?.status === postStatuEnum.AWAITING_APPROVAL) &&
                                        <div className='w-full flex flex-row gap-3 mt-5'>
                                            <button onClick={handleRejectPost} className='w-full bg-red-200 border-[2px] border-red-600 text-red-600 font-bold p-2 rounded-lg text-base'>Reject</button>
                                            <button onClick={handleApprovePost} className='w-full bg-green-200 border-[2px] border-green-600 text-green-600 font-bold p-2 rounded-lg text-base'>Approve</button>
                                        </div>
                                    }

                                    {
                                        !post.isDeleted && (
                                            <div className='flex justify-between'>
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
                                                {user?.id === post?.authorId && (post?.status === postStatuEnum.DRAFT || post?.status === postStatuEnum.REJECTED || post?.status === postStatuEnum.SCHEDULED)  && (
                                                    <button
                                                        onClick={() => router.push(`/editpost/${post.slug}`)}



                                                        className=' bg-green-200 border-[2px] border-green-600 text-green-600 font-bold px-6 rounded-lg text-base'
                                                    >
                                                        Edit Post
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    }

                                    {
                                        post.isDeleted && user.role === userRoles.SUPERADMIN &&

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

                                    {
                                        post.status === postStatuEnum.DRAFT &&
                                        <div className='w-full flex flex-row gap-3 mt-5'>
                                            <button onClick={() => handlePublished(post?._id)} className='w-full bg-green-200 border-[2px] border-green-600 text-green-600 font-bold p-2 rounded-lg text-base'>Publish Post</button>
                                        </div>
                                    }


                                    {/* Render Comments */}
                                    {/* Render Comments only if the post status is not DRAFT or SCHEDULED */}
                                    {
    post.status !== postStatuEnum.DRAFT &&
    post.status !== postStatuEnum.SCHEDULED &&
    comments.length > 0 && ( // Check if comments exist
        <div>
            <h2 className='text-xl font-semibold'>Comments </h2>
            <div className='mt-5 overflow-y-auto max-h-[600px] bg-[#1A1A1A] rounded-md py-3 px-3'>
                
                {comments.map((comment: IComment) => (
                    <div key={comment._id} className='flex items-start mb-4 border-b pb-2'>
                        <img
                            src={`https://ui-avatars.com/api/?name=${comment.userDetails?.name}&size=40`}
                            alt={comment.userDetails?.name}
                            className='w-10 h-10 rounded-full mr-3'
                        />
                        <div className='flex-1'>
                            <p className='font-semibold'>
                                {comment.userDetails?.name} <span className='text-gray-600 text-sm'>{handleDate(comment.createdAt)}</span>
                            </p>
                            <p className='text-gray-200'>{comment.message}</p>
                            {(user?.id === comment.userDetails?.id || user.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) && (
                                <div className='flex justify-end'>
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className='bg-red-500 text-white px-2 py-1 text-semibold rounded-lg mt-1'
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {hasMore && (
                    <div className='flex justify-center'>
                        <button
                            onClick={() => fetchComments(post?._id, lastId)}
                            className='bg-blue-400 border-[1px] border-blue-400 text-white p-2 rounded-lg'
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
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