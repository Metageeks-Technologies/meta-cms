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
         <h1 className="font-bold mb-6 text-center text-5xl text-gray-800">Comments</h1>
{comments.length === 0 ? (
    <p className="text-gray-500 text-center text-lg italic">No comments at this time.</p>
) : (
    <ul className="space-y-6">
        {comments.map(comment => (
            <li key={comment._id} className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-900 transition-transform transform ">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-blue-300">Post: {comment.postId.title}</h2>
                    <p className="text-sm text-gray-400">Commented by <strong>{comment.userId.name}</strong> on <em>{new Date(comment.createdAt).toLocaleString()}</em></p>
                </div>
                <p>Comment Message</p>
                <p className="text-gray-200 border-l-4 border-blue-500 pl-4 mb-4 italic bg-gray-800 p-3 rounded">"{comment.message}"</p>
                <p className="text-sm text-gray-400 mb-4"><strong>Status:</strong> <span className={`font-semibold ${comment.status === 'published' ? 'text-green-400' : 'text-orange-300'}`}>{comment.status}</span></p>
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
    </>
)}
{comment.status === 'published' && (
    <button 
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
        onClick={() => changeStatus(comment._id, comment.postId._id, 'rejected')}
    >
        Reject
    </button>
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
