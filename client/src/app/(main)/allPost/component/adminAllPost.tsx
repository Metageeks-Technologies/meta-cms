'use client'
import axiosCall from '@/utils/ApiCall';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Card from './card';
import { postStatuEnum, statusArrAdminAllPost } from '@/constant/post';
import { useUserContext } from '@/context/userContext';
import toast from 'react-hot-toast';

const AdminAllPost = () => {

    const [filterBy, setFilterBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [postData, setPostData] = useState<any>(null);
    const {setLoading} = useUserContext();


    async function fetchAllPosts() {
        setPostData(null);
        setLoading(true);
        try {
            if (filterBy === postStatuEnum.DRAFT) {
                const param = new URLSearchParams();
                if (sortBy) param.append('sortBy', sortBy);
                const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/drafts?${param.toString()}`);

                if (resp.status === 200 || resp.status === 201) {
                    setPostData(resp.data);
                    // console.log(resp);
                }else{
                    toast.error(resp.data.message, {
                        duration: 2000,
                    });
                }

            } else {
                const param = new URLSearchParams();
                if (filterBy) {
                    if (filterBy === '') {
                    } else if (filterBy === "deleted") {
                        param.append('isDeleted', 'true');
                    } else {
                        param.append('status', filterBy.toLowerCase());
                    }
                }

                if (sortBy) param.append('sortBy', sortBy);

                const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts?${param.toString()}`);
                // console.log(resp)

                if (resp.status === 200 || resp.status === 201) {
                    setPostData(resp.data);
                    // console.log(resp);
                }else{
                    toast.error(resp.data.message, {
                        duration: 2000,
                    });
                }
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllPosts();
    }, [filterBy, sortBy]);




    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8  px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {
                        statusArrAdminAllPost.map((status, index) => (
                            <div key={index} onClick={() => setFilterBy(status.query)} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy == status.query ? "text-blue-800 border-blue-800" : ""}`}>
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
                    <select onChange={(e) => setSortBy(e.target.value)} name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
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

export default AdminAllPost