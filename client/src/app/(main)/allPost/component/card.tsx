'use client'
import { handleDate } from '@/utils/helperFunction';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import { getURL } from '@/utils/AWS_Config';


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
        const previewText = plainText.slice(0, 80) + (plainText.length > 80 ? '...' : '');
        setPlainText(previewText);
    }

    useEffect(() => {
        PreviewHTML(post.description);
    }, [post.description]);
    // PreviewHTML(post.description);


    return (
        <div key={index} onClick={() => router.push(`/post/${post.slug}`)} className='w-80 my-2 md:my-5 group rounded-lg cursor-pointer'>
            <div className='w-full h-[250px] '>
                <img src={getURL(post.previewImageKey)} alt="Blog Image" className='w-full h-full object-cover rounded-t-lg' />
                {/* <img src="/blogImg.png" alt="Blog Image" className='w-full h-full object-cover rounded-t-lg' /> */}

            </div>

            <div className='text-gray-200 flex flex-col gap-1 md:gap-3 mt-2 text-sm md:text-base'>
                {
                    post.isDeleted &&
                    <p className='text-red-500 font-bold text-sm -mb-2'>Post Deleted</p>
                }
                <div className='flex flex-row justify-between'>
                    <p className='text-[#6941C6] text-sm'>{post.author.name} | {handleDate(post.publishedDate)}</p>
                    <p className=' text-sm'>{post.status}</p>
                </div>
                <h2 className='text-xl md:text-2xl group-hover:underline cursor-pointer'    >{post.title} &#8599;</h2>
                <p className='text-gray-400'>{plainText}</p>
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
            </div>
        </div>
    )
}

export default Card