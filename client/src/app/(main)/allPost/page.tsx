'use client'
import { ArrowUpRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { blogPosts } from './data';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"



const page = () => {

    const statusArr = ['All', 'Publish', 'Draft', 'Schedule', 'Rejected', 'Await approve', 'Delete'];


    const router = useRouter();

    const [filterBy, setFilterBy] = useState('all');
    const [postData, setPostData] = useState(blogPosts);

    const handleFilter = (value: string) => {
        if (value === 'all') {
            setFilterBy('all');
            setPostData(blogPosts);
            return;
        }
        const filteredData = blogPosts.filter((blog) => blog.status === value);
        setPostData(filteredData);
        setFilterBy(value);
    }


    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8  px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {
                        statusArr.map((status, index) => (
                            <div key={index} onClick={() => handleFilter(status.toLowerCase())} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy == status.toLowerCase() ? "text-blue-800 border-blue-800" : ""}`}>
                                {
                                    filterBy === status.toLocaleLowerCase() ?
                                        <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                        : null
                                }
                                <span>{status}</span>
                            </div>
                        ))
                    }

                </div>

                <div className='flex flex-row items-center'>
                    <select name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
                        <option value="#">-- Sort by --</option>
                        <option value="#">Recent</option>
                        <option value="#">Tranding</option>
                        <option value="#">Popular</option>
                    </select>
                </div>

            </div>

            <div className='w-full h-full flex flex-row flex-wrap items-start justify-center gap-5 p-4'>

                {
                    postData.map((post, index) => (
                        <div key={index} onClick={() => router.push(`/post/${post.id}`)} className='max-w-72 my-2 md:my-5 group cursor-pointer rounded-lg'>
                            <div className='w-full'>
                                <img src={post.image ? "" : "/blogImg.png"} alt="Blog Image" className='w-full object-cover rounded-t-lg' />
                            </div>

                            <div className='text-gray-200 flex flex-col gap-1 md:gap-3 mt-2 text-sm md:text-base'>
                                <div className='flex flex-row justify-between'>
                                    <p className='text-[#6941C6] text-sm'>{post.author} | {post.date}</p>
                                    <p className=' text-sm'>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</p>
                                </div>
                                <h2 className='text-xl md:text-2xl group-hover:underline'>{post.title} &#8599;</h2>
                                <p className='text-gray-400'>{post.excerpt}</p>
                                <div className={`w-full flex flex-row flex-wrap gap-2`}>
                                    {
                                        post.tags.map((tag, index) => (
                                            <div key={index}
                                                className={`px-2 rounded-full 
                                                ${index % 5 === 0 ? "bg-[#E3F2FD] text-[#1E88E5]"
                                                        : index % 5 === 1 ? "bg-[#FFEBEE] text-[#E53935]"
                                                            : index % 5 === 2 ? "bg-[#E8F5E9] text-[#43A047]"
                                                                : index % 5 === 3 ? "bg-[#FFF3E0] text-[#FB8C00]"
                                                                    : index % 5 === 4 ? "bg-[#F3E5F5] text-[#8E24AA]"
                                                                        : null
                                                    } text-xs md:text-sm`}
                                            >{tag}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }

                {/* <Pagination className='text-gray-200'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}

            </div>
        </div>
    )
}

export default page
