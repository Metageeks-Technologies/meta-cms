'use client'
import { handleDate } from '@/utils/helperFunction';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import { getURL } from '@/utils/AWS_Config';
import { ArrowUpRight } from 'lucide-react';

const Card = ({ post, index }: any) => {
    const router = useRouter();
    
    const [plainText, setPlainText] = useState('');

    function stripHTML(html: any) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    function PreviewHTML(description: any,) {
        const sanitizedHTML = DOMPurify.sanitize(description);
        const plainText = stripHTML(sanitizedHTML);
        const previewText = plainText.slice(0, 120) + (plainText.length > 120 ? '...' : '');
        setPlainText(previewText);
    }

    useEffect(() => {
        PreviewHTML(post.description);
    }, [post.description]);

    const getTagColor = (index: number) => {
        const colorSchemes = [
            { bg: 'bg-blue-50', text: 'text-blue-600' },
            { bg: 'bg-red-50', text: 'text-red-600' },
            { bg: 'bg-green-50', text: 'text-green-600' },
            { bg: 'bg-orange-50', text: 'text-orange-600' },
            { bg: 'bg-purple-50', text: 'text-purple-600' }
        ];
        return colorSchemes[index % colorSchemes.length];
    };

    // Function to get status color
    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'published':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'draft':
                return 'bg-yellow-100 text-yellow-700';
            case 'pending':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Function to truncate title
    const truncateTitle = (title: string, maxLength: number) => {
        return title.length > maxLength 
            ? title.slice(0, maxLength) + '...' 
            : title;
    };

    return (
        <div 
            key={index} 
            onClick={() => router.push(`/post/${post.slug}`)} 
            className='
                w-full h-[500px] max-w-[350px] bg-gray-900 
                rounded-xl overflow-hidden shadow-lg transform 
                transition-all duration-300 hover:scale-[1.02] 
                hover:shadow-2xl cursor-pointer group border 
                border-gray-800 flex flex-col
            '
        >
            {/* Image Section */}
            <div className='relative h-56 overflow-hidden'>
                <img 
                    src={getURL(post.previewImageKey)} 
                    alt="Blog Image" 
                    className='
                        w-full h-full object-cover 
                        group-hover:scale-110 transition-transform 
                        duration-300
                    ' 
                />
                {post.isDeleted && (
                    <div className='
                        absolute top-2 right-2 bg-red-500/80 
                        text-white px-2 py-1 rounded-full 
                        text-xs font-bold
                    '>
                        Deleted
                    </div>
                )}

            </div>

            {/* Content Section */}
            <div className='p-4 flex flex-col space-y-3 flex-grow'>
                {/* Author and Date */}
                <div className='flex justify-between items-center text-xs text-gray-400'>
                    <span className='flex items-center space-x-2'>
                        <span className='text-purple-500'>{post.author.name}</span>
                        <span className='text-gray-600'>•</span>
                        <span>{handleDate(post.publishedDate)}</span>
                    </span>
                    <span className={`
                        px-2 py-1 
                        rounded-md text-[10px] font-medium
                        ${getStatusColor(post.status)}
                    `}>
                        {post.status}
                    </span>
                </div>

                {/* Title */}
                <h2 className='
                    text-xl font-bold text-white 
                    group-hover:text-blue-400 transition-colors
                    flex items-center h-14 overflow-hidden
                '>
                    {truncateTitle(post.title, 35)}
                    <ArrowUpRight className='ml-2 w-5 h-5 text-gray-500 group-hover:text-blue-400' />
                </h2>

                {/* Description */}
                <p className='text-gray-400 text-sm line-clamp-2 flex-grow'>
                    {plainText}
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 mt-auto'>
                    {post.tags.map((tag: string, index: number) => {
                        const { bg, text } = getTagColor(index);
                        return (
                            <span 
                                key={index} 
                                className={`
                                    ${bg} ${text} 
                                    px-2 py-1 rounded-full 
                                    text-xs font-medium
                                `}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Card