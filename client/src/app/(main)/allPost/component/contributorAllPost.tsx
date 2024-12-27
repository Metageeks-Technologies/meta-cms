'use client'
import axiosCall from '@/utils/ApiCall';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Card from './card';
import toast from 'react-hot-toast';

const ContributorAllPost = () => {


    const statusArr = [
        {
            label: 'Publish',
            query: "published",
            function: fetchPublishedPost,
        },
        {
            label: 'Draft',
            query: "draft",
            function: fetchDraftPosts,
        },
        {
            label: 'Schedule',
            query: "scheduled",
            function: fetchSchedulePosts,
        },
        {
            label: 'Rejected',
            query: "rejected",
            function: fetchRejectedPosts,
        },
        {
            label: 'Await approve',
            query: "awaiting approval",
            function: fetchAwaitApprovePosts,
        },
        {
            label: 'Deleted',
            query: "deleted",
            function: fetchDeletedPosts,
        },
    ];


    const [filterBy, setFilterBy] = useState('published');

    console.log(filterBy, "filterBy");
    const [sortBy, setSortBy] = useState('');
    // console.log(sortBy)
    const [postData, setPostData] = useState<any>(null);


    const handleSortByChange = (value: any) => {

        switch (filterBy) {
            case 'published':
                fetchPublishedPost(value);
                break;
            case 'draft':
                fetchDraftPosts(value);
                break;
            case 'scheduled':
                fetchSchedulePosts(value);
                break;
            case 'rejected':
                fetchRejectedPosts(value);
                break;
            case 'awaiting approval':
                fetchAwaitApprovePosts(value);
                break;
            case 'deleted':
                fetchDeletedPosts(value);
                break;
            default:
                break;
        }

    }



    async function fetchPublishedPost(query?: string) {
        setFilterBy('published');
        setPostData(null);
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/published?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchDraftPosts(query?: string) {
        setFilterBy('draft');
        setPostData(null);
        try {

            const param = new URLSearchParams();

            if (query) param.append("sortBy", query);
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/drafts?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchSchedulePosts(query?: string) {
        setFilterBy('scheduled');
        setPostData(null);
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/scheduled?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchRejectedPosts(query?: string) {
        setFilterBy('rejected');
        setPostData(null);
        try {
            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/rejected?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchAwaitApprovePosts(query?: string) {
        setFilterBy('awaiting approval');
        setPostData(null);
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/awaiting-approval?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchDeletedPosts(query?: string) {
        setFilterBy('deleted');
        setPostData(null);
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/deleted?${param.toString()}`);

            if (resp) {
                setPostData(resp);
                // console.log(resp);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPublishedPost();
    }, []);

    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8  px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {
                        statusArr.map((status, index) => (
                            <div key={index} onClick={() => status.function()} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy == status.query ? "text-blue-800 border-blue-800" : ""}`}>
                                {
                                    filterBy === status.query ?
                                        <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                        : null
                                }
                                <span>{status.label}</span>
                            </div>
                        ))
                    }

                </div>

                <div className='flex flex-row items-center'>
                    <select onChange={(e) => handleSortByChange(e.target.value)} name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
                        <option value="">-- Sort by --</option>
                        {/* <option value="trending">Trending</option> */}
                        <option value="popular">Popular</option>
                        <option value="recent">Recent</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

            </div>

            <div className='w-full h-full flex flex-row flex-wrap items-start justify-center gap-5 p-4'>

                {
                    postData ?
                        (
                            <div className='flex flex-row flex-wrap items-start justify-center gap-5 '>
                                {
                                    postData.length > 0 ?
                                        postData.map((post: any, index: number) => (
                                            <Card key={index} index={index} post={post} />
                                        ))
                                        : <p className='mt-10 text-3xl '>No posts found.</p>
                                }
                            </div>
                        )
                        : <p className='mt-10 text-xl'>Loading...</p>   
                }

            </div>
        </div>
    )
}

export default ContributorAllPost