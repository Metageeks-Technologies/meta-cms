'use client'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
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
import { FaClock, FaSquareXTwitter } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiFacebook } from 'react-icons/si'
import { RiInstagramFill } from 'react-icons/ri'
import { ImLinkedin } from 'react-icons/im'


const page = () => {
    const { setLoading, user } = useUserContext();
    const [post, setPost] = useState<PostTypes | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [lastId, setLastId] = useState<string>('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [comments, setComments] = useState<IComment[]>([])
    const [categoryList, setCategoryList] = useState('');

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
                setCategoryList(resp.data.categories.map((item: any) => item.name).join(", "))
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
                    setPost((prevPost: any) => ({
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

    useEffect(() => {

        // Find all the script tags within the content
        const scripts = post?.description?.match(/<script([\s\S]*?)>([\s\S]*?)<\/script>/g);

        if (scripts) {
            scripts.forEach((script) => {
                // Create a new script element
                const newScript = document.createElement("script");


                // Use a regex to extract attributes and content
                const attrMatch = script.match(/<script([\s\S]*?)>([\s\S]*?)<\/script>/);
                if (attrMatch) {
                    // Set attributes if any
                    const attributesString = attrMatch[1]; // This will contain the attributes
                    const content = attrMatch[2]; // This will contain the script content

                    // Set attributes to the new script element
                    attributesString.trim().split(/\s+/).forEach(attr => {
                        const [key, value] = attr.split('=');
                        if (value) {
                            newScript.setAttribute(key, value.replace(/['"]/g, '')); // Remove quotes
                        } else {
                            newScript.setAttribute(key, ''); // For boolean attributes like 'async'
                        }
                    });

                    // Set the inner content of the new script
                    newScript.textContent = content.trim();
                }

                // Append the new script to the document body
                document.body.appendChild(newScript);
            });
        }
    }, [post]);



    return (
        <div className='w-full text-gray-200 p-3 sm:p-8 flex flex-col items-start'>
            <div className='rotate-180 my-3'>
                <ArrowRight className='w-5 sm:w-8 h-4 sm:h-8 cursor-pointer' onClick={() => router.push('/allPost')} />
            </div>

            {
                !isLoading ?
                    <div className='w-full md:w-[800px] mx-auto '>
                        {
                            post?.title ?
                                <div className='flex flex-col gap-5'>
                                    <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold'>{post?.title}</h1>

                                    <div className='w-full mb-2 sm:mb-4 flex flex-row justify-between'>
                                        <div className='w-full flex flex-row items-center gap-3'>
                                            <Avatar className='w-12 h-12'>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <div className='w-full flex flex-row flex-wrap gap-2'>
                                                    {
                                                        post?.categories.length > 0 &&
                                                        post?.categories.map((category) => (
                                                            <p key={category._id} className='max-w-min bg-white text-black rounded-lg px-2 text-nowrap'>{category?.name}</p>
                                                        ))
                                                    }
                                                </div>
                                                <p className='font-bold'>{post.author.name} | {handleDate(post.publishedDate)}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-2 items-center'>
                                            {
                                                post?.readTime &&
                                                <div className='flex flex-row gap-2 items-center text-nowrap'>
                                                    <FaClock />
                                                    {post.readTime}
                                                </div>
                                            }
                                            |
                                            <div className='flex flex-row items-center text-nowrap'>Likes : {post.likesCount}</div>
                                        </div>
                                    </div>

                                    <img src={getURL(post?.previewImageKey)} className='w-full object-contain' />
                                    {/* <img src={"/blogImg.png"} className='w-full object-contain' /> */}
                                    <div className="tinymce-content" id='postContent' dangerouslySetInnerHTML={{ __html: post?.description }}></div>
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

                                    <div className='flex justify-between mt-4'>
                                        {/* Existing Delete Post button */}
                                        {!post.isDeleted && (
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
                                        )}

                                        {/* Existing Edit Post button */}
                                        {(user?.id === post?.authorId || user.role === userRoles.SUPERADMIN) && (
                                            <button
                                                onClick={() => router.push(`/editpost/${post.slug}`)}
                                                className='bg-green-200 border-[2px] border-green-600 text-green-600 font-bold px-6 rounded-lg text-base'
                                            >
                                                Edit Post
                                            </button>
                                        )}
                                    </div>


                                    {
                                        post.isDeleted && user.role === userRoles.SUPERADMIN &&

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className='bg-green-500 max-w-min text-white px-6  text-base rounded-lg font-bold hover:bg-green-700'>Recover Post</Button>
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

                                    <div className={`w-full flex flex-row flex-wrap gap-2`}>
                                        {
                                            post.tags.map((tag: string, index: number) => (
                                                <div key={index}
                                                    className={`px-2 rounded-full 
                                                            ${index % 5 === 0 ? "bg-[#E3F2FD] text-[#1E88E5]"
                                                            : index % 5 === 1 ? "bg-[#FFEBEE] text-[#E53935]"
                                                                : index % 5 === 2 ? "bg-[#E8F5E9] text-[#43A047]"
                                                                    : index % 5 === 3 ? "bg-[#FFF3E0] text-[#FB8C00]"
                                                                        : index % 5 === 4 ? "bg-[#F3E5F5] text-[#8E24AA]"
                                                                            : null
                                                        } text-xs md:text-sm`}
                                                >
                                                    {tag}
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className='w-full flex flex-row gap-5 my-5'>
                                        <Avatar className='w-20 h-20'>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <div className='w-full'>
                                            <div className='w-full flex flex-row justify-between'>
                                                <p className='text-xl font-bold'>Written by {post.author.name}</p>

                                                <div className='flex flex-row items-center gap-3'>
                                                    {
                                                        post.author?.socialLinks.facebook &&
                                                        <a href={post.author?.socialLinks.facebook} target='_blank'>
                                                            <SiFacebook className='text-2xl text-blue-500' />
                                                        </a>
                                                    }
                                                    {
                                                        post.author?.socialLinks.instagram &&
                                                        <a href={post.author?.socialLinks.instagram} target='_blank'>
                                                            <RiInstagramFill className='text-3xl text-red-500' />
                                                        </a>
                                                    }
                                                    {
                                                        post.author?.socialLinks.linkedIn &&
                                                        <a href={post.author?.socialLinks.linkedIn} target='_blank'>
                                                            <ImLinkedin className='text-2xl text-blue-500' />
                                                        </a>
                                                    }
                                                    {
                                                        post.author?.socialLinks.twitter &&
                                                        <a href={post.author?.socialLinks.twitter} target='_blank'>
                                                            <FaSquareXTwitter className='text-3xl text-gray-800' />
                                                        </a>
                                                    }
                                                </div>
                                            </div>
                                            <p className='text-gray-400 text-sm'>{post.author.bio}</p>
                                        </div>

                                    </div>



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
                                        post.status !== postStatuEnum.DRAFT &&
                                        post.status !== postStatuEnum.SCHEDULED &&
                                        comments.length != 0 && ( // Check if comments exist
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