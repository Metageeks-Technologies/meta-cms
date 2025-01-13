'use client';
import React, { useState } from 'react';
import { dummyComments } from '@/constant/comments';

const CommentsPage: React.FC = () => {
    const [comments, setComments] = useState(dummyComments);
    const [filter, setFilter] = useState<'all' | 'awaiting' | 'published' | 'rejected'>('all');

    const changeStatus = (id: number, newStatus: string) => {
        setComments(prevComments =>
            prevComments.map(comment => {
                if (comment.id === id) {
                    return { ...comment, status: newStatus };
                }
                return comment;
            })
        );
    };

    // Filter comments based on selected filter
    const filteredComments = comments.filter(comment => {
        if (filter === 'all') return true;
        if (filter === 'awaiting') return comment.status === 'awaiting approval';
        if (filter === 'published') return comment.status === 'published';
        if (filter === 'rejected') return comment.status === 'rejected';
        return false;
    });

    return (
        <div className="p-6 mx-auto bg-black text-white">
            <h1 className="font-bold mb-4 text-center text-4xl">Comments</h1>
            <div className="mb-4 flex justify-center space-x-4">
                <button className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`} onClick={() => setFilter('all')}>All</button>
                <button className={`px-4 py-2 rounded ${filter === 'awaiting' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`} onClick={() => setFilter('awaiting')}>Awaiting Approval</button>
                <button className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`} onClick={() => setFilter('published')}>Published</button>
                <button className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`} onClick={() => setFilter('rejected')}>Rejected</button>
            </div>
            {filteredComments.length === 0 ? (
                <p className="text-gray-400 text-center">No comments at this time.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredComments.map(comment => (
                        <li key={comment.id} className={`border border-gray-700 p-4 rounded-lg shadow bg-gray-800`}>
                            <p><strong>User Name:</strong> {comment.author}</p>
                            <p><strong>Post Title:</strong> {comment.postId}</p>
                            <p><strong>Message:</strong> {comment.message}</p>
                            <p><strong>Status:</strong> <span className="font-semibold text-orange-300">{comment.status}</span></p>
                            <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleString()}</p>
                            <div className="mt-2 space-x-2">
                                {comment.status === 'awaiting approval' && (
                                    <>
                                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500 transition" onClick={() => changeStatus(comment.id, 'published')}>Publish</button>
                                        <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition" onClick={() => changeStatus(comment.id, 'rejected')}>Reject</button>
                                    </>
                                )}
                                {comment.status === 'published' && (
                                    <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition" onClick={() => changeStatus(comment.id, 'rejected')}>Reject</button>
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
