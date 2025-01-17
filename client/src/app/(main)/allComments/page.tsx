'use client';
import React, { useState, useEffect } from 'react';
import axiosCall from "@/utils/ApiCall";
import { IComment } from '@/types';
import { useUserContext } from '@/context/userContext';



const CommentsPage: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);
    const { isLoading ,setLoading}: any = useUserContext();

    const [filter, setFilter] = useState<'awaiting approval' | 'published' | 'rejected' | 'deleted'>('awaiting approval');
    const [lastCommentId, setLastCommentId] = useState<string | null>(null); // Track the last comment ID
    const [hasMore, setHasMore] = useState(true); // To check if there are more comments to load
const fetchComments = async (status: string, lastId: string | null) => {
    setLoading(true);
    try {
        const endpointMap: { [key: string]: string } = {
            'awaiting approval': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/awating-approval`,
            'published': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-published${lastId ? `?lastId=${lastId}` : ''}`,
            'rejected': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-rejected`,
            'deleted': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-deleted`
        };
        const resp = await axiosCall('get', endpointMap[status]);
        console.log(resp.data);
        // Check for an array response
        if (Array.isArray(resp.data)) {
            setComments(prev => [...prev, ...resp.data]);
            setHasMore(resp.data.length > 0);
            if (resp.data.length > 0) {
                setLastCommentId(resp.data[resp.data.length - 1]._id);
            } else {
                setHasMore(false);
            }
        } else {
            setComments([]); // Clear comments if unexpected response
            setHasMore(false); // Disable loading more if the response is not valid
        }
    } catch (error) {
        setComments([]); // Clear comments on error
        setHasMore(false); // Disable loading more on error
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        setComments([]); // Reset comments when filter changes
        setLastCommentId(null); // Reset last comment ID
        fetchComments(filter, null); // Fetch comments without a last ID
    }, [filter]);
    const loadMoreComments = () => {
        if (hasMore && lastCommentId) {
            fetchComments(filter, lastCommentId);
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const optionsTime: any = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
        return `${day}/${month}/${year} ${formattedTime}`;
    };
    const changeStatus = async (commentId: string, postId: string, newStatus: 'published' | 'rejected' | 'deleted' | 'awaiting approval') => {
        try {
            let endpoint;
            if (newStatus === 'published') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${postId}/approve/${commentId}`;
            } else if (newStatus === 'rejected') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/reject/${commentId}`;
            } else if (newStatus === 'deleted') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/delete/${commentId}`;
            } else {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/revert/${commentId}`;
            }
            await axiosCall('patch', endpoint);
            // Refetch comments after status change
            fetchComments(filter, lastCommentId);
        } catch (error) {
            console.error('Error updating comment status:', error);
        }
    };
    if (isLoading) {
        return <p className="text-center">Loading comments...</p>;
    }
    return (
        <div className="p-6 mx-auto bg-black text-white">
            <div className="mb-4 flex space-x-4">
                <button onClick={() => setFilter('awaiting approval')} className={`px-4 py-2 rounded ${filter === 'awaiting approval' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400`}>
                    Awaiting Approval
                </button>
                <button onClick={() => setFilter('published')} className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400`}>
                    Published
                </button>
                <button onClick={() => setFilter('rejected')} className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400`}>
                    Rejected
                </button>
                <button onClick={() => setFilter('deleted')} className={`px-4 py-2 rounded ${filter === 'deleted' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400`}>
                    Deleted
                </button>
            </div>
            {comments.length === 0 ? (
                <p className="text-gray-500 text-center text-lg italic">No comments at this time.</p>
            ) : (
                <ul className="space-y-6">
                    {comments.map(comment => (
                        <li key={comment._id} className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-900 transition-transform transform">
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-blue-300">Post: {comment.postId.title}</h2>
                                <p className="text-sm text-gray-400">
                                    Commented by <strong>{comment.userDetails?.name}</strong> on <em>{formatDate(comment.createdAt)}</em>
                                </p>
                            </div>
                            <p>Comment Message</p>
                            <p className="text-gray-200 border-l-4 border-blue-500 pl-4 mb-4 italic bg-gray-800 p-3 rounded">{comment.message}</p>
                            <p className="text-sm text-gray-400 mb-4"><strong>Status:</strong> <span className={`font-semibold ${comment.status === 'published' ? 'text-green-400' : comment.status === 'rejected' ? 'text-red-400' : comment.status === 'deleted' ? 'text-gray-600' : 'text-orange-300'}`}>{comment.status}</span></p>
                            <div className="mt-4 flex space-x-3">
                                {comment.status === 'awaiting approval' && (
                                    <>
                                        <button
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postId._id, 'published')}
                                        >
                                            Publish
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postId._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postId._id, 'deleted')}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {comment.status === 'published' && (
                                    <>
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postId._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postId._id, 'deleted')}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {comment.status === 'rejected' && (
                                    <button
                                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                                        onClick={() => changeStatus(comment._id, comment.postId._id, 'awaiting approval')}
                                    >
                                        Revert to Awaiting Approval
                                    </button>
                                )}
                                {comment.status === 'deleted' && (
                                    <button
                                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                                        onClick={() => changeStatus(comment._id, comment.postId._id, 'awaiting approval')}
                                    >
                                        Restore
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {hasMore && filter === 'published' && (
                <div className="mt-4">
                    <button onClick={loadMoreComments} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200">
                        Load More Comments
                    </button>
                </div>
            )}
        </div>
    );
};
export default CommentsPage;