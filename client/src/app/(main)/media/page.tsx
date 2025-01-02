'use client'
import { dummyMedia } from '@/constant/post';
import { usePostContext } from '@/context/postContext';
import { MediaType } from '@/types';
import { s3 } from '@/utils/AWS_Config';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [filterBy, setFilterBy] = useState('all');
    const [mediaData, setMediaData] = useState(dummyMedia);

    const { media, fetchMedia } = usePostContext();


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

    const getURL = (key : string) => {
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET, 
            Key: key
        }
        const url = s3.getSignedUrl('getObject', params);
        console.log(url, "Url")
        return url;
    }


    useEffect(() => {
        fetchMedia();
    }, []);

    return (
        <div className='px-2 py-10 sm:px-5 sm:py-10 md:p-10'>

            {/* <div className='w-full flex flex-row gap-4'>
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
            </div> */}


            <div className='flex flex-row flex-wrap justify-center gap-3 my-10'>

                {
                    media?.map((media: MediaType, index: number) => (
                        <div key={media._id} className='w-80'>
                            <img src={getURL(media.key)} alt="" loading='lazy' className='w-full h-full object-cover' />
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default page