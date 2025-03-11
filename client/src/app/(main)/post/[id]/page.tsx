'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowRight, TriangleAlert, Trash2 } from 'lucide-react';
import { PostTypes } from '@/types';
import { postStatuEnum } from '@/constant/post';
import axiosCall from '@/utils/ApiCall';
import { handleDate } from '@/utils/helperFunction';
import toast from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';
import { getURL } from '@/utils/AWS_Config';
import { IComment } from '@/types';
import { FaClock } from 'react-icons/fa6';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SiFacebook } from 'react-icons/si';
import { RiInstagramFill } from 'react-icons/ri';
import { ImLinkedin } from 'react-icons/im';
import { FaHeart } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const page = () => {
    const { setLoading, user, websiteKey } = useUserContext();
    const [post, setPost] = useState<PostTypes | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<string>('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [comments, setComments] = useState<IComment[]>([]);
    const [categoryList, setCategoryList] = useState('');

    const router = useRouter();
    const params = useParams();
    const slug = params.id;

    const fetchPost = async () => {
        setLoading(true);
        setIsLoading(true);
        try {
            const resp = await axiosCall(
                'get',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
                undefined,
                { websiteKey },
            );
            if (resp.status === 200 || resp.status === 201) {
                setPost(resp.data);
                if (resp.data?._id) {
                    await fetchComments(resp.data._id);
                }
                setCategoryList(
                    resp.data.categories
                        .map((item: any) => item.name)
                        .join(', '),
                );
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error('Failed to fetch post.', { duration: 2000 });
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

            const resp = await axiosCall(
                'get',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/public/comment/${postId}?${param.toString()}`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                const newComments = resp.data;
                const uniqueComments = [
                    ...new Map(
                        [...comments, ...newComments].map((comment) => [
                            comment._id,
                            comment,
                        ]),
                    ).values(),
                ];
                setComments(uniqueComments);
                if (newComments.length < 5) {
                    setHasMore(false);
                }
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error('Failed to fetch comments.', { duration: 2000 });
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'DELETE',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${post?._id}/delete/${commentId}`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success('Comment Deleted', { duration: 2000 });
                setComments((prev) => {
                    setPost((prevPost: any) => ({
                        ...prevPost,
                        commentCount:
                            prevPost.commentCount > 0
                                ? prevPost.commentCount - 1
                                : 0,
                    }));
                    return prev.filter((comment) => comment._id !== commentId);
                });
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            toast.error('Failed to delete comment.', { duration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleRejectPost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'patch',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/reject`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success('Post Rejected', { duration: 2000 });
                fetchPost();
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'patch',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/approve`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success('Post Approved', { duration: 2000 });
                fetchPost();
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'DELETE',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data?.message, { duration: 2000 });
                router.back();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecoverPost = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'patch',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?._id}/recover`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp?.data.message, { duration: 2000 });
                fetchPost();
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublished = async (id: string) => {
        setLoading(true);
        try {
            const payload = {
                status: postStatuEnum.PUBLISHED,
            };
            const resp = await axiosCall(
                'patch',
                `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`,
                payload,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success('Post Published', { duration: 2000 });
                fetchPost();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (websiteKey) {
            fetchPost();
        }
    }, [websiteKey]);

    useEffect(() => {
        setLastId(comments[comments.length - 1]?._id || '');
    }, [comments]);

    useEffect(() => {
        const scripts = post?.description?.match(
            /<script([\s\S]*?)>([\s\S]*?)<\/script>/g,
        );
        if (scripts) {
            scripts.forEach((script) => {
                const newScript = document.createElement('script');
                const attrMatch = script.match(
                    /<script([\s\S]*?)>([\s\S]*?)<\/script>/,
                );
                if (attrMatch) {
                    const attributesString = attrMatch[1];
                    const content = attrMatch[2];
                    attributesString
                        .trim()
                        .split(/\s+/)
                        .forEach((attr) => {
                            const [key, value] = attr.split('=');
                            if (value) {
                                newScript.setAttribute(
                                    key,
                                    value.replace(/['"]/g, ''),
                                );
                            } else {
                                newScript.setAttribute(key, '');
                            }
                        });
                    newScript.textContent = content.trim();
                }
                document.body.appendChild(newScript);
            });
        }
    }, [post]);

    return (
        <div className="w-full min-h-screen bg-black text-white p-4 md:p-8">
    {/* Back button with improved hover effect */}
    <button 
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
        onClick={() => router.push('/allPost')}
    >
        <ArrowRight className="w-6 h-6 rotate-180" />
        <span className="text-sm font-medium">Back to Posts</span>
    </button>

    {!isLoading ? (
        <div className="max-w-4xl mx-auto mt-8">
            {post?.title ? (
                <>
                {/* Author and Post Info with improved spacing */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14 border-2 border-blue-500/20 ring-2 ring-blue-500/10">
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
                        <div className="flex items-center gap-6">
                            {post?.readTime && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <FaClock className="text-gray-500" />
                                    <span>{post.readTime} read</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-rose-400">
                                <FaHeart className="text-rose-500" />
                                <span>{post.likesCount}</span>
                            </div>
                        </div>
                    </div>
                    {/* Title with subtle animation */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                        {post?.title}
                    </h1>

                    

                    {/* Categories with improved styling */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post?.categories.map((category) => (
                            <span
                                key={category._id}
                                className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-colors duration-300"
                            >
                                {category?.name}
                            </span>
                        ))}
                    </div>

                    {/* Main Image with shadow and styling */}
                    <div className="rounded-xl overflow-hidden mb-10 shadow-lg shadow-blue-500/5 border border-gray-800">
                        <img
                            src={getURL(post?.previewImageKey)}
                            alt={post?.title}
                            className="w-full object-cover max-h-[500px]"
                        />
                    </div>

                    {/* Post Content with improved typography */}
                    <div
                        className="prose prose-invert prose-lg max-w-none mb-12 break-words prose-a:text-blue-400 prose-headings:text-gray-100 prose-strong:text-white prose-blockquote:border-blue-500"
                        dangerouslySetInnerHTML={{
                            __html: post?.description,
                        }}
                    ></div>

                   
                    

                    {/* Admin Metadata Section with improved styling */}
                    {(user?.role === userRoles.SUPERADMIN ||
                        user?.role === userRoles.ADMIN ||
                        user?.role === userRoles.MODERATOR) && (
                        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 mb-10 border border-gray-800 shadow-lg">
                            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span> 
                                Metadata Information
                            </h2>

                            {/* Meta Data Section with improved visual hierarchy */}
                            <div className="mb-8">
                                <h3 className="text-lg text-blue-400 font-semibold mb-4 border-b border-gray-800 pb-2">
                                    Meta Data
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-1">
                                            Meta Title:
                                        </p>
                                        <p className="text-gray-300">
                                            {post?.metaTitle || 'Not set'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-1">
                                            Meta Description:
                                        </p>
                                        <p className="text-gray-300">
                                            {post?.metaDescription || 'Not set'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-2">
                                            Keywords:
                                        </p>
                                        {post?.keywords &&
                                        Array.isArray(post.keywords) &&
                                        post.keywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {post.keywords.map(
                                                    (keyword, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gray-700/70 text-gray-300 rounded-md text-sm border border-gray-600"
                                                        >
                                                            {keyword}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No keywords set
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Open Graph Section with improved visual hierarchy */}
                            <div className="pt-6 border-t border-gray-800">
                                <h3 className="text-lg text-green-400 font-semibold mb-4 border-b border-gray-800 pb-2">
                                    Open Graph Data
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-1">
                                            OG Title:
                                        </p>
                                        <p className="text-gray-300">
                                            {post?.ogTitle || 'Not set'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-1">
                                            OG Description:
                                        </p>
                                        <p className="text-gray-300">
                                            {post?.ogDescription || 'Not set'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-300 text-sm font-semibold mb-2">
                                            OG Image:
                                        </p>
                                        {post?.ogImageKey ? (
                                            <img
                                                src={getURL(post.ogImageKey)}
                                                alt="Open Graph Image"
                                                className="w-full max-w-md h-auto rounded-lg border border-gray-700 shadow-md mt-2"
                                            />
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No OG image set
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Tags with improved styling */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {post.tags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>


                    {/* Admin Actions with improved button styling */}
                    {(user?.role === userRoles.SUPERADMIN ||
                        user?.role === userRoles.MODERATOR ||
                        user?.role === userRoles.ADMIN) &&
                        post?.status === postStatuEnum.AWAITING_APPROVAL &&
                        !(
                            user?.role !== userRoles.SUPERADMIN &&
                            user?.role !== userRoles.ADMIN &&
                            post?.author?.role === userRoles.SUPERADMIN
                        ) &&
                        !post?.isDeleted && (
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={handleRejectPost}
                                    className="flex-1 px-6 py-3 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/10"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprovePost}
                                    className="flex-1 px-6 py-3 bg-green-500/90 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-500/10"
                                >
                                    Approve
                                </button>
                            </div>
                        )}

                    {/* Post Actions with improved styling */}
                    <div className="flex flex-wrap gap-4 mb-10">
                        {!post.isDeleted &&
                            !(
                                user?.role !== userRoles.SUPERADMIN &&
                                user?.role !== userRoles.ADMIN &&
                                post?.author?.role === userRoles.SUPERADMIN
                            ) && (
                                <AlertDialog>
                                    <AlertDialogTrigger className="flex items-center gap-2 px-5 py-3 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg shadow-red-500/10">
                                        <Trash2 className="w-5 h-5" />
                                        <span>Delete</span>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="bg-gray-900 border-gray-800 rounded-xl shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription>
                                                <div className="flex flex-col items-center gap-6 py-4">
                                                    <TriangleAlert className="w-20 h-20 text-red-500" />
                                                    <h2 className="text-2xl font-semibold text-gray-100">
                                                        Delete Post
                                                    </h2>
                                                    <p className="text-gray-300 text-center">
                                                        Are you sure you want to delete this Post? 
                                                        <br/>This action cannot be undone.
                                                    </p>
                                                </div>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 font-medium">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeletePost}
                                                className="bg-red-500 text-white hover:bg-red-600 font-medium shadow-md"
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
                                post?.author?.role === userRoles.SUPERADMIN
                            ) && (
                                <button
                                    onClick={() => router.push(`/editpost/${post.slug}`)}
                                    className="flex items-center gap-2 px-5 py-3 bg-blue-500/90 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                        <path d="m15 5 4 4"></path>
                                    </svg>
                                    <span>Edit Post</span>
                                </button>
                            )}

                        {post.status === 'draft' ||
                            (post.status === 'rejected' && (
                                <Button
                                    onClick={() => handlePublished(post._id)}
                                    className="flex items-center gap-2 px-5 py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors font-medium shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5 12 5 5L20 7"></path>
                                    </svg>
                                    <span>Publish Post</span>
                                </Button>
                            ))}

                        {(user.role === userRoles.SUPERADMIN ||
                            user.role === userRoles.ADMIN) &&
                            post.isDeleted && (
                                <Button
                                    onClick={handleRecoverPost}
                                    className="flex items-center gap-2 px-5 py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors font-medium shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 14 4 9l5-5"></path>
                                        <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H10"></path>
                                    </svg>
                                    <span>Recover Post</span>
                                </Button>
                            )}
                    </div>
                    <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 mb-10 border border-gray-800 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <Avatar className="w-20 h-20 border-2 border-blue-500/20">
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
                                <p className="text-xl text-blue-400 font-semibold mb-3">
                                    Written by {post.author.name}
                                </p>
                                <p className="text-gray-300 mb-5 leading-relaxed">
                                    {post.author.bio}
                                </p>
                                <div className="flex gap-5">
                                    {post.author?.socialLinks?.facebook && (
                                        <a
                                            href={post.author?.socialLinks.facebook}
                                            target="_blank"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <SiFacebook size={22} />
                                        </a>
                                    )}
                                    {post.author?.socialLinks?.instagram && (
                                        <a
                                            href={post.author?.socialLinks.instagram}
                                            target="_blank"
                                            className="text-rose-400 hover:text-rose-300 transition-colors"
                                        >
                                            <RiInstagramFill size={22} />
                                        </a>
                                    )}
                                    {post.author?.socialLinks?.linkedIn && (
                                        <a
                                            href={post.author?.socialLinks.linkedIn}
                                            target="_blank"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <ImLinkedin size={20} />
                                        </a>
                                    )}
                                    {post.author?.socialLinks?.twitter && (
                                        <a
                                            href={post.author?.socialLinks.twitter}
                                            target="_blank"
                                            className="text-gray-400 hover:text-gray-300 transition-colors"
                                        >
                                            <BsTwitterX size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    {/* Comments with improved styling */}
                    {post.status !== postStatuEnum.DRAFT &&
                        post.status !== postStatuEnum.SCHEDULED &&
                        comments.length > 0 && (
                            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 border border-gray-800 shadow-lg">
                                <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Comments ({comments.length})
                                </h2>
                                <div className="space-y-8">
                                    {comments.map((comment: IComment) => (
                                        <div
                                            key={comment._id}
                                            className="border-b border-gray-800 pb-8 last:border-0"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-4">
                                                    <img
                                                        src={
                                                            user?.imageKey
                                                                ? getURL(user?.imageKey)
                                                                : `https://ui-avatars.com/api/?name=${comment.userDetails?.name}&size=48&background=334155&color=ffffff`
                                                        }
                                                        alt={comment.userDetails?.name}
                                                        className="w-12 h-12 rounded-full ring-2 ring-gray-800"
                                                    />
                                                    <div>
                                                        <p className="text-blue-400 font-medium">
                                                            {comment.userDetails?.name}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">
                                                            {handleDate(comment.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {(user?.id === comment.userDetails?.id ||
                                                    user.role === userRoles.SUPERADMIN ||
                                                    user.role === userRoles.MODERATOR) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="bg-red-500/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg flex items-center gap-1.5"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        </svg>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-200 leading-relaxed pl-16">
                                                {comment.message}
                                            </p>
                                        </div>
                                    ))}
                                    {hasMore && (
                                        <button
                                            onClick={() => fetchComments(post?._id, lastId)}
                                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium mt-4"
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
};

export default page;
