'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { SetStateAction, useEffect, useState } from 'react'
import { blogPosts } from '@/app/(main)/allPost/data'
import { ArrowRight } from 'lucide-react'

const page = () => {

    interface Post {
        id: number;
        title: string;
        image: string;
        author: string;
        date: string;
        excerpt: string;
        content: string;
        tags: string[];
    }

    const [post, setPost] = useState<Post | undefined>(undefined);
    const pathname = usePathname();
    const router = useRouter();


    useEffect(() => {
        const pathArr = pathname.split('/');
        const id = pathArr[pathArr.length - 1];
        const postArr = blogPosts.filter((post) => post.id.toString() == id.toString());
        setPost(postArr[0]);
    }, [pathname]);


    return (
        <div className='text-gray-200 p-3 sm:p-8 flex flex-col items-start'>
            <div className='rotate-180 my-3'>
                <ArrowRight className='w-5 sm:w-8 h-4 sm:h-8 cursor-pointer' onClick={() => router.back()} />
            </div>

            <div className='max-w-[800px] mx-auto flex flex-col gap-5'>
                <h1 className='text-2xl sm:text-3xl md:text-5xl mb-2 sm:mb-4 font-bold'>{post?.title}</h1>
                <p>{post?.excerpt}</p>
                <img src={post?.image ? post.image : "/blogImg.png"} className='w-full object-contain' />
                <p>{post?.content}</p>
                <div className='w-full flex flex-row justify-end gap-2'>
                    <p>Author : {post?.author}</p> |
                    <p>Date : {post?.date}</p>
                </div>
            </div>
        </div>
    )
}

export default page