'use client'
import { dummyMedia } from '@/constant/post';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';
import React, { useState } from 'react'


const page = () => {

    useAuth();

    const [filterBy, setFilterBy] = useState('all');
    const [mediaData, setMediaData] = useState(dummyMedia);

    const handleFilter = (value: string) => {
        if (value === 'all') {
            setFilterBy('all');
            setMediaData(dummyMedia);
            return;
        }

        const filteredData = dummyMedia.filter((data) => data.type === value);
        setMediaData(filteredData);
        setFilterBy(value);
    }


    return (
        <div className='px-2 py-10 sm:px-5 sm:py-10 md:p-10'>

            <div className='w-full flex flex-row gap-4'>
                <div onClick={() => handleFilter('all')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer text-sm sm:text-base ${filterBy == "all" ? "text-blue-800 border-blue-800" : ""}`}>
                    {
                        filterBy === 'all' ?
                            <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                            : null
                    }
                    <span>All</span>
                </div>
                <div onClick={() => handleFilter('image')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer text-sm sm:text-base ${filterBy == "image" ? "text-blue-800 border-blue-800" : ""}`}>
                    {
                        filterBy === 'image' ?
                            <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                            : null
                    }
                    <span>Photos</span>
                </div>
                <div onClick={() => handleFilter('video')} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer text-sm sm:text-base ${filterBy == "video" ? "text-blue-800 border-blue-800" : ""}`}>
                    {
                        filterBy === 'video' ?
                            <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                            : null
                    }
                    <span>Videos</span>
                </div>
            </div>


            <div className='flex flex-row flex-wrap justify-center gap-3 my-10'>

                {
                    mediaData.map((media, index) => (
                        <div key={media.id} className='w-80'>
                            {
                                media.type == 'image' ?
                                    <img src={media.url} alt="" loading='lazy' className='w-full h-full object-cover' />
                                    : <video src={media.url} controls className='w-full h-full object-cover'></video>
                            }
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default page