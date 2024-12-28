import { postStatuEnum } from '@/constant/post';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaRegNewspaper } from 'react-icons/fa';

const ContributorCardsRow = () => {

    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [totalPublished, setTotalPublished] = useState<number>(0);
    const [totalDraft, setTotalDraft] = useState<number>(0);
    const [totalAwaiting, setTotalAwaiting] = useState<number>(0);

    const fetchAllContributorPosts = async (status?: any) => {
        try {
            const param = new URLSearchParams();
            if(status) param.append('status', status);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/all?${param.toString()}`);

            // console.log(resp,"Response my all");

            if(resp.status === 200 || resp.status === 201) {
                return resp?.data?.length
            }else{
                toast.error(resp?.data?.message, {
                    duration: 2000
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setAllStates = async () => {
        const allPostCount = await fetchAllContributorPosts();
        setTotalPosts(allPostCount);

        const allPublishedPostsCount = await fetchAllContributorPosts(postStatuEnum.PUBLISHED);
        setTotalPublished(allPublishedPostsCount);

        const allDraftPostsCount = await fetchAllContributorPosts(postStatuEnum.DRAFT);
        setTotalDraft(allDraftPostsCount);

        const allAwaitingPostsCount = await fetchAllContributorPosts(postStatuEnum.AWAITING_APPROVAL);
        setTotalAwaiting(allAwaitingPostsCount);
    }



    useEffect(() => {
        setAllStates();
    },[]);


    return (
        <div className="mx-auto p-4 flex flex-wrap">

            <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
                <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
                    <p>Total Posts</p>
                    <FaRegNewspaper className='text-2xl' />
                </div>
                <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalPosts}</p>
            </div>


            <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
                <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
                    <p>Total Published</p>
                    <FaRegNewspaper className='text-2xl' />
                </div>
                <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalPublished}</p>
            </div>

            <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
                <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
                    <p>Total Draft</p>
                    <FaRegNewspaper className='text-2xl' />
                </div>
                <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalDraft}</p>
            </div>

            <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
                <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
                    <p>Total Awaiting approval</p>
                    <FaRegNewspaper className='text-2xl' />
                </div>
                <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalAwaiting}</p>
            </div>

        </div>
    )
}

export default ContributorCardsRow