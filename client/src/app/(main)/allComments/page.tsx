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
    const [hasMore, setHasMore] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingMessage, setEditingMessage] = useState<string>('');
    const COMMENTS_PER_PAGE = 10;

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
                
                
                setHasMore(resp.data.length >= COMMENTS_PER_PAGE);
                
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
            <div className="mb-8 flex space-x-4">
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
                <div className="flex flex-col items-center justify-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
                    <p className="text-gray-500 text-lg md:text-xl text-center italic">No comments at this time.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {comments.map(comment => (
                        <li key={comment._id} className="border border-gray-800 rounded-lg shadow-lg overflow-hidden bg-gray-900/80 hover:bg-gray-900 transition-colors duration-200">
                            <div className="bg-gray-800/60 px-4 py-3 border-b border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center">
                                <h2 className="text-sm md:text-base font-semibold text-blue-300 truncate">{comment.postDetails.title}</h2>
                                <p className="text-xs text-gray-400 mt-1 md:mt-0">
                                    <span className="bg-gray-900 px-2 py-0.5 rounded-full">
                                        {comment.userDetails?.name || "Anonymous"}
                                    </span> • <em>{formatDate(comment.createdAt)}</em>
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center mb-2">
                                    <div className={`h-2 w-2 rounded-full mr-2 ${
                                        comment.status === 'published' ? 'bg-green-400' : 
                                        comment.status === 'rejected' ? 'bg-red-400' : 
                                        comment.status === 'deleted' ? 'bg-gray-600' : 'bg-orange-300'
                                    }`}></div>
                                    <span className={`text-xs font-medium ${
                                        comment.status === 'published' ? 'text-green-400' : 
                                        comment.status === 'rejected' ? 'text-red-400' : 
                                        comment.status === 'deleted' ? 'text-gray-600' : 'text-orange-300'
                                    }`}>
                                        {comment.status.replace(/^\w/, (c) => c.toUpperCase())}
                                    </span>
                                </div>
                                
                                {editingCommentId === comment._id ? (
                                    <>
                                        <textarea
                                            className="w-full p-3 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                            value={editingMessage}
                                            onChange={(e) => setEditingMessage(e.target.value)}
                                            rows={4}
                                            placeholder="Edit your comment..."
                                        />
                                        <div className="mt-3 flex space-x-2">
                                            <button
                                                className="text-xs md:text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5"
                                                onClick={() => handleUpdateComment(comment._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Save
                                            </button>
                                            <button
                                                className="text-xs md:text-sm bg-gray-700 text-gray-200 px-4 py-1.5 rounded-md hover:bg-gray-600 transition-colors shadow-sm"
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
                                    <div className="text-sm text-gray-200 bg-gray-800/70 p-3 rounded-md mb-4 border-l-4 border-blue-500">
                                        {comment.message}
                                    </div>
                                )}
                                
                                <div className="mt-4 border-t border-gray-800 pt-4 flex flex-wrap gap-2">
                                    {(comment.status === 'awaiting approval' && !comment.isDeleted) && (
                                        <>
                                            <button
                                                className="text-xs md:text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-500 transition-all duration-200 shadow-sm flex items-center gap-1"
                                                onClick={() => changeStatus(comment._id, comment.postDetails._id, 'published')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                Publish
                                            </button>
                                            <button
                                                className="text-xs md:text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-500 transition-all duration-200 shadow-sm flex items-center gap-1"
                                                onClick={() => changeStatus(comment._id, comment.postDetails._id, 'rejected')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Reject
                                            </button>
                                            <button
                                                className="text-xs md:text-sm bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 transition-all duration-200 shadow-sm flex items-center gap-1"
                                                onClick={() => changeStatus(comment._id, comment.postDetails._id, 'deleted')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {(comment.status === 'published' && !comment.isDeleted) && (
                                        <button
                                            className="text-xs md:text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-500 transition-all duration-200 shadow-sm flex items-center gap-1"
                                            onClick={() => changeStatus(comment._id, comment.postDetails._id, 'deleted')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Delete
                                        </button>
                                    )}
                                    {comment.status === 'rejected' && (
                                        <button 
                                            onClick={() => handleEdit(comment)} 
                                            className="text-xs md:text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-500 transition-all duration-200 shadow-sm flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Edit
                                        </button>
                                    )}
                                    {comment.isDeleted && (
                                        <button
                                            onClick={() => recoverComment(comment._id)}
                                            className="text-xs md:text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-500 transition-all duration-200 shadow-sm flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Recover
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {hasMore && (filter === 'published' || filter === 'rejected' || filter === 'deleted') && (
                <div className="mt-6 flex justify-center">
                    <button 
                        onClick={loadMoreComments} 
                        className="text-xs md:text-sm bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-500 transition-all duration-200 shadow-md flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Load More Comments
                    </button>
                </div>
            )}
            
            
        </div>
    );
};

export default CommentsPage;