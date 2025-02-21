'use client';
import React, { useState, useEffect } from 'react';
import axiosCall from "@/utils/ApiCall";
import { IComment } from '@/types';
import { useUserContext } from '@/context/userContext';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

const CommentsPage: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);
    const { isLoading, setLoading, websiteKey }: any = useUserContext();
    const [filter, setFilter] = useState<'awaiting approval' | 'published' | 'rejected' | 'deleted'>('awaiting approval');
    const [lastCommentId, setLastCommentId] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingMessage, setEditingMessage] = useState<string>('');
    const fetchComments = async (status: string, lastId: string | null) => {
        setLoading(true);
        try {
            const endpointMap: { [key: string]: string } = {
                'awaiting approval': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/awaiting-approval`,
                'published': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-published${lastId ? `?lastId=${lastId}` : ''}`,
                'rejected': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-rejected${lastId ? `?lastId=${lastId}` : ''}`,
                'deleted': `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/all-deleted${lastId ? `?lastId=${lastId}` : ''}`
            };

            const resp = await axiosCall('get', endpointMap[status], undefined, { websiteKey });


            if (Array.isArray(resp.data)) {
                if (lastId) {
                    setComments(prev => [...prev, ...resp.data]);
                } else {
                    setComments(resp.data);
                }
                setHasMore(resp.data.length > 0);
                if (resp.data.length > 0) {
                    setLastCommentId(resp.data[resp.data.length - 1]._id);
                } else {
                    setHasMore(false);
                }
            } else {
                setComments([]);
                setHasMore(false);
            }
        } catch (error) {
            toast.error('Failed to fetch comments');
            setComments([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (websiteKey) fetchComments(filter, null);
    }, [filter, websiteKey]);

    useEffect(() => {
        setLastCommentId(null);
        fetchComments(filter, null);
    }, [filter]);

    const handleEdit = (comment: IComment) => {
        setEditingCommentId(comment._id);
        setEditingMessage(comment.message);
    };

    const handleUpdateComment = async (commentId: string) => {
        try {
            const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/edit/${commentId}`;
            await axiosCall('patch', endpoint, { message: editingMessage }, { websiteKey });
            toast.success('Comment updated successfully');
            fetchComments(filter, null);
            setEditingCommentId(null);
        } catch (error) {
            toast.error('Error updating comment');
            fetchComments(filter, null);
        }
    };

    const changeStatus = async (commentId: string, postId: string, newStatus: 'published' | 'rejected' | 'deleted' | 'awaiting approval') => {
        try {
            let endpoint;
            if (newStatus === 'published') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${postId}/approve/${commentId}`;
            } else if (newStatus === 'rejected') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/reject/${commentId}`;
            } else if (newStatus === 'deleted') {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${postId}/delete/${commentId}`;
                await axiosCall('DELETE', endpoint, undefined, { websiteKey });
                toast.success('Comment deleted successfully');
                fetchComments(filter, null);
                return;
            } else {
                endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/edit/${commentId}`;
            }

            await axiosCall('patch', endpoint, undefined, { websiteKey });
            toast.success('Comment status updated successfully');
            fetchComments(filter, null);
        } catch (error) {
            toast.error('Error updating comment status');
        }
    };

    const recoverComment = async (commentId: string) => {
        try {
            const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/recover/${commentId}`;
            await axiosCall('patch', endpoint, undefined, { websiteKey });
            toast.success('Comment recovered successfully');
            fetchComments(filter, null);
        } catch (error) {
            toast.error('Error recovering comment');
        }
    };

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

    return (
        <div className="p-6 mx-auto bg-black text-white mb-9">
            <div className="mb-4 flex space-x-4">
                {['awaiting approval', 'published', 'rejected', 'deleted'].map(status => (
                    <div
                        key={status}
                        onClick={() => setFilter(status as 'awaiting approval' | 'published' | 'rejected' | 'deleted')}
                        className={`bg-gray-900 px-2 py-1 sm:px-2 sm:py-2 rounded-lg border-[1px] border-gray-800 flex items-center gap-2 cursor-pointer ${filter === status ? 'text-blue-800 border-blue-800 bg-blue-500' : 'text-white'}`}
                    >
                        {filter === status && (
                            <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                        )}
                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </div>
                ))}
            </div>


            {comments.length === 0 ? (
                <p className=" mt-auto text-gray-500 text-3xl text-center  italic">No comments at this time.</p>
            ) : (
                <ul className="space-y-6">
                    {comments.map(comment => (
                        <li key={comment._id} className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-900">
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-blue-300">Post: {comment.postDetails.title}</h2>
                                <p className="text-sm text-gray-400">
                                    Commented by <strong>{comment.userDetails?.name}</strong> on <em>{formatDate(comment.createdAt)}</em>
                                </p>
                            </div>
                            {editingCommentId === comment._id ? (
                                <>
                                    <textarea
                                        className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-600 rounded"
                                        value={editingMessage}
                                        onChange={(e) => setEditingMessage(e.target.value)}
                                    />
                                    <div className="mt-2 flex space-x-2">
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                                            onClick={() => handleUpdateComment(comment._id)}
                                        >
                                            Submit
                                        </button>
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                                            onClick={() => {
                                                setEditingCommentId(null); 
                                                setEditingMessage(''); 
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-200 border-l-4 border-blue-500 pl-4 mb-4 italic bg-gray-800 p-3 rounded">
                                    {comment.message}
                                </p>
                            )}

                            <p className="text-sm text-gray-400 mb-4">
                                <strong>Status: </strong>
                                <span className={`font-semibold ${comment.status === 'published' ? 'text-green-400' : comment.status === 'rejected' ? 'text-red-400' : comment.status === 'deleted' ? 'text-gray-600' : 'text-orange-300'}`}>
                                    {comment.status.replace(/^\w/, (c) => c.toUpperCase())}
                                </span>
                            </p>
                            <div className="mt-4 flex space-x-3">
                                {(comment.status === 'awaiting approval' && !comment.isDeleted) && (
                                    <>
                                        <button
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'published')}
                                        >
                                            Publish
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'deleted')}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {(comment.status === 'published' && !comment.isDeleted) && (
                                    <>
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'deleted')}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {comment.status === 'rejected' && (
                                    <button onClick={() => handleEdit(comment)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200">Edit</button>
                                )}
                                {comment.isDeleted && (
                                    <button
                                        onClick={() => recoverComment(comment._id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
                                    >
                                        Recover
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {hasMore && (filter === 'published' || filter === 'rejected' || filter === 'deleted') && (
                <div className="mt-4 flex justify-center">
                    <button onClick={loadMoreComments} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentsPage;
