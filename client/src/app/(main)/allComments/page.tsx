'use client';
import React, { useState, useEffect } from 'react';
import axiosCall from "@/utils/ApiCall";
import { IComment } from '@/types';

const CommentsPage: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/awating-approval`);

            // Check the response structure
            if (Array.isArray(resp.data)) {
                setComments(resp.data); 
            } else {
                console.error('Expected an array of comments but got:', resp.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const changeStatus = async (commentId: string, postId: string, newStatus: 'published' | 'rejected') => {
        try {
            if (newStatus === 'published') {
                await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/${postId}/approve/${commentId}`);
            } else if (newStatus === 'rejected') {
                await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/comment/reject/${commentId}`);
            }
            
            // Update the local state
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, status: newStatus };
                    }
                    return comment;
                })
            );
        } catch (error) {
            console.error('Error updating comment status:', error);
        }
    };

    if (loading) {
        return <p className="text-center">Loading comments...</p>;
    }

    return (
        <div className="p-6 mx-auto bg-black text-white">
            <h1 className="font-bold mb-4 text-center text-4xl">Comments</h1>
            {comments.length === 0 ? (
                <p className="text-gray-400 text-center">No comments at this time.</p>
            ) : (
                <ul className="space-y-4">
                    {comments.map(comment => (
                        <li key={comment._id} className={`border border-gray-700 p-4 rounded-lg shadow bg-gray-800`}>
                            <p><strong>User Name:</strong> {comment.userId.name}</p>
                            <p><strong>Post Title:</strong> {comment.postId.title}</p>
                            <p><strong>Message:</strong> {comment.message}</p>
                            <p><strong>Status:</strong> <span className="font-semibold text-orange-300">{comment.status}</span></p>
                            <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleString()}</p>
                            <div className="mt-2 space-x-2">
                                {comment.status === 'awaiting approval' && (
                                    <>
                                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500 transition" onClick={() => changeStatus(comment._id, comment.postId._id, 'published')}>Publish</button>
                                        <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition" onClick={() => changeStatus(comment._id, comment.postId._id, 'rejected')}>Reject</button>
                                    </>
                                )}
                                {comment.status === 'published' && (
                                    <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition" onClick={() => changeStatus(comment._id, comment.postId._id, 'rejected')}>Reject</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommentsPage;
