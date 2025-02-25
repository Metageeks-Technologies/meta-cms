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
import { FaClock } from "react-icons/fa6"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiFacebook } from 'react-icons/si'
import { RiInstagramFill } from 'react-icons/ri'
import { ImLinkedin } from 'react-icons/im'
import { FaHeart } from "react-icons/fa"
import { BsTwitterX } from "react-icons/bs"

const page = () => {
    const { setLoading, user, websiteKey } = useUserContext()
    const [post, setPost] = useState<PostTypes | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastId, setLastId] = useState<string>('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isFetching, setIsFetching] = useState(false)
    const [comments, setComments] = useState<IComment[]>([])
    const [categoryList, setCategoryList] = useState('')

    const router = useRouter();
    const params = useParams();
    const slug = params.id;

    const fetchPost = async () => {
        setLoading(true)
        setIsLoading(true)
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`, undefined, { websiteKey })
            if (resp.status === 200 || resp.status === 201) {
                setPost(resp.data)
                if (resp.data?._id) {
                    await fetchComments(resp.data._id)
                }
                setCategoryList(resp.data.categories.map((item: any) => item.name).join(", "))
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            toast.error("Failed to fetch post.", { duration: 2000 })
        } finally {
            setIsLoading(false)
            setLoading(false)
        }
    }

    const fetchComments = async (postId: string, lastId?: string) => {
        if (!postId || isFetching) return

        setIsFetching(true)
        try {
            const param = new URLSearchParams()
            if (lastId) param.append('lastId', lastId)
            param.append('page', String(page))

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/public/comment/${postId}?${param.toString()}`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                const newComments = resp.data
                const uniqueComments = [...new Map([...comments, ...newComments].map(comment => [comment._id, comment])).values()]
                setComments(uniqueComments)
                if (newComments.length < 5) {
                    setHasMore(false)
                }
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            toast.error("Failed to fetch comments.", { duration: 2000 })
        } finally {
            setIsFetching(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        setLoading(true)
        try {
            const resp = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${post?._id}/delete/${commentId}`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Comment Deleted", { duration: 2000 })
                setComments((prev) => {
                    setPost((prevPost: any) => ({
                        ...prevPost,
                        commentCount: prevPost.commentCount > 0 ? prevPost.commentCount - 1 : 0
                    }))
                    return prev.filter(comment => comment._id !== commentId)
                })
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            toast.error("Failed to delete comment.", { duration: 2000 })
        } finally {
            setLoading(false)
        }
    }

    const handleRejectPost = async () => {
        setLoading(true)
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/reject`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Rejected", { duration: 2000 })
                fetchPost()
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprovePost = async () => {
        setLoading(true)
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/approve`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Approved", { duration: 2000 })
                fetchPost()
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePost = async () => {
        setLoading(true)
        try {
            const resp = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data?.message, { duration: 2000 })
                router.back()
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleRecoverPost = async () => {
        setLoading(true)
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/recover`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data.message, { duration: 2000 })
                fetchPost()
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePublished = async (id: string) => {
        setLoading(true)
        try {
            const payload = {
                status: postStatuEnum.PUBLISHED,
            }
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`, payload, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                toast.success("Post Published", { duration: 2000 })
                fetchPost()
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (websiteKey) {
            fetchPost()
        }
    }, [websiteKey])

    useEffect(() => {
        setLastId(comments[comments.length - 1]?._id || '')
    }, [comments])

    useEffect(() => {
        const scripts = post?.description?.match(/<script([\s\S]*?)>([\s\S]*?)<\/script>/g)
        if (scripts) {
            scripts.forEach((script) => {
                const newScript = document.createElement("script")
                const attrMatch = script.match(/<script([\s\S]*?)>([\s\S]*?)<\/script>/)
                if (attrMatch) {
                    const attributesString = attrMatch[1]
                    const content = attrMatch[2]
                    attributesString.trim().split(/\s+/).forEach(attr => {
                        const [key, value] = attr.split('=')
                        if (value) {
                            newScript.setAttribute(key, value.replace(/['"]/g, ''))
                        } else {
                            newScript.setAttribute(key, '')
                        }
                    })
                    newScript.textContent = content.trim()
                }
                document.body.appendChild(newScript)
            })
        }
    }, [post])

    return (
        <div className="w-full min-h-screen bg-black text-white p-4 md:p-8">
            <ArrowRight
                className="w-8 h-8 rotate-180 cursor-pointer hover:text-gray-300"
                onClick={() => router.push('/allPost')}
            />

            {!isLoading ? (
                <div className="max-w-3xl mx-auto mt-6">
                    {post?.title ? (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold mb-6">
                                {post?.title}
                            </h1>

                            {/* Author and Post Info */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border border-gray-700">
                                        <AvatarImage
                                            src={
                                                user?.imageKey
                                                    ? getURL(user?.imageKey)
                                                    : 'https://github.com/shadcn.png'
                                            }
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xl text-blue-400 font-semibold">
                                            {post?.author?.name}
                                        </p>
                                        <p className="text-gray-400">
                                            {handleDate(post.publishedDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {post?.readTime && (
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FaClock />
                                            <span>{post.readTime}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-rose-500">
                                        <FaHeart />
                                        <span>{post.likesCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post?.categories.map((category) => (
                                    <span
                                        key={category._id}
                                        className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm hover:bg-gray-700"
                                    >
                                        {category?.name}
                                    </span>
                                ))}
                            </div>

                            {/* Main Image */}
                            <img
                                src={getURL(post?.previewImageKey)}
                                alt={post?.title}
                                className="w-full rounded-lg mb-8 object-cover max-h-[500px]"
                            />

                            {/* Post Content */}
                            <div
                                className="prose prose-invert max-w-none mb-8"
                                dangerouslySetInnerHTML={{
                                    __html: post?.description,
                                }}
                            ></div>

                            {/* Admin Actions */}
                            {(user?.role === userRoles.SUPERADMIN ||
                                user?.role === userRoles.MODERATOR ||
                                user?.role === userRoles.ADMIN) &&
                                post?.status ===
                                    postStatuEnum.AWAITING_APPROVAL &&
                                !(
                                    user?.role !== userRoles.SUPERADMIN &&
                                    user?.role !== userRoles.ADMIN &&
                                    post?.author?.role === userRoles.SUPERADMIN
                                ) && (
                                    <div className="flex gap-4 mb-8">
                                        <button
                                            onClick={handleRejectPost}
                                            className="flex-1 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={handleApprovePost}
                                            className="flex-1 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                )}

                            {/* Post Actions */}
                            <div className="flex gap-4 mb-8">
                                {!post.isDeleted &&
                                    !(
                                        user?.role !== userRoles.SUPERADMIN &&
                                        user?.role !== userRoles.ADMIN &&
                                        post?.author?.role ===
                                            userRoles.SUPERADMIN
                                    ) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="bg-red-500 hover:bg-red-600 text-white">
                                                    Delete Post
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-black border border-gray-800">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Confirm Deletion
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={
                                                            handleDeletePost
                                                        }
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                {(user?.id === post?.authorId ||
                                    user.role === userRoles.SUPERADMIN ||
                                    user.role === userRoles.ADMIN) &&
                                    !(
                                        user?.role !== userRoles.SUPERADMIN &&
                                        user?.role !== userRoles.ADMIN &&
                                        post?.author?.role ===
                                            userRoles.SUPERADMIN
                                    ) && (
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/editpost/${post.slug}`,
                                                )
                                            }
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            Edit Post
                                        </button>
                                    )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-800 text-emerald-400 rounded-full text-sm hover:bg-gray-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Author Bio */}
                            <div className="bg-gray-900 rounded-lg p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-16 h-16 border border-gray-700">
                                        <AvatarImage
                                            src={
                                                user?.imageKey
                                                    ? getURL(user?.imageKey)
                                                    : 'https://github.com/shadcn.png'
                                            }
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-xl text-blue-400 font-semibold mb-2">
                                            Written by {post.author.name}
                                        </p>
                                        <p className="text-gray-400 mb-4">
                                            {post.author.bio}
                                        </p>
                                        <div className="flex gap-4">
                                            {post.author?.socialLinks
                                                ?.facebook && (
                                                <a
                                                    href={
                                                        post.author?.socialLinks
                                                            .facebook
                                                    }
                                                    target="_blank"
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <SiFacebook size={24} />
                                                </a>
                                            )}
                                            {post.author?.socialLinks
                                                ?.instagram && (
                                                <a
                                                    href={
                                                        post.author?.socialLinks
                                                            .instagram
                                                    }
                                                    target="_blank"
                                                    className="text-rose-400 hover:text-rose-300"
                                                >
                                                    <RiInstagramFill
                                                        size={24}
                                                    />
                                                </a>
                                            )}
                                            {post.author?.socialLinks
                                                ?.linkedIn && (
                                                <a
                                                    href={
                                                        post.author?.socialLinks
                                                            .linkedIn
                                                    }
                                                    target="_blank"
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <ImLinkedin size={24} />
                                                </a>
                                            )}
                                            {post.author?.socialLinks
                                                ?.twitter && (
                                                <a
                                                    href={
                                                        post.author?.socialLinks
                                                            .twitter
                                                    }
                                                    target="_blank"
                                                    className="text-gray-400 hover:text-gray-300"
                                                >
                                                    <BsTwitterX size={24} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments */}
                            {post.status !== postStatuEnum.DRAFT &&
                                post.status !== postStatuEnum.SCHEDULED &&
                                comments.length > 0 && (
                                    <div className="bg-gray-900 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold mb-6">
                                            Comments ({comments.length})
                                        </h2>
                                        <div className="space-y-6">
                                            {comments.map(
                                                (comment: IComment) => (
                                                    <div
                                                        key={comment._id}
                                                        className="border-b border-gray-800 pb-6 last:border-0"
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex gap-3">
                                                                <img
                                                                    src={
                                                                        user?.imageKey
                                                                            ? getURL(
                                                                                  user?.imageKey,
                                                                              )
                                                                            : `https://ui-avatars.com/api/?name=${comment.userDetails?.name}&size=40`
                                                                    }
                                                                    alt={
                                                                        comment
                                                                            .userDetails
                                                                            ?.name
                                                                    }
                                                                    className="w-10 h-10 rounded-full"
                                                                />
                                                                <div>
                                                                    <p className="text-blue-400 font-medium">
                                                                        {
                                                                            comment
                                                                                .userDetails
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-gray-400 text-sm">
                                                                        {handleDate(
                                                                            comment.createdAt,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {(user?.id ===
                                                                comment
                                                                    .userDetails
                                                                    ?.id ||
                                                                user.role ===
                                                                    userRoles.SUPERADMIN ||
                                                                user.role ===
                                                                    userRoles.MODERATOR) && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteComment(
                                                                            comment._id,
                                                                        )
                                                                    }
                                                                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-300">
                                                            {comment.message}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                            {hasMore && (
                                                <button
                                                    onClick={() =>
                                                        fetchComments(
                                                            post?._id,
                                                            lastId,
                                                        )
                                                    }
                                                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                                >
                                                    Load More Comments
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </>
                    ) : (
                        <p className="text-center text-xl text-gray-400">
                            No post found
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <p className="text-xl text-gray-400">Loading...</p>
                </div>
            )}
        </div>
    );
}

export default page