'use client'
import { Check } from 'lucide-react';
import React, { useState } from 'react'

const data = [
    { "id": 1, "type": "image", "url": "https://picsum.photos/300/200?random=1" },
    { "id": 2, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "3 sec" },
    { "id": 3, "type": "image", "url": "https://picsum.photos/300/200?random=2" },
    { "id": 4, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 5, "type": "image", "url": "https://picsum.photos/300/200?random=3" },
    { "id": 6, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 7, "type": "image", "url": "https://picsum.photos/300/200?random=4" },
    { "id": 8, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" },
    { "id": 9, "type": "image", "url": "https://picsum.photos/300/200?random=5" },
    { "id": 10, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 11, "type": "image", "url": "https://picsum.photos/300/200?random=6" },
    { "id": 12, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 13, "type": "image", "url": "https://picsum.photos/300/200?random=7" },
    { "id": 14, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 15, "type": "image", "url": "https://picsum.photos/300/200?random=8" },
    { "id": 16, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 17, "type": "image", "url": "https://picsum.photos/300/200?random=9" },
    { "id": 18, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 19, "type": "image", "url": "https://picsum.photos/300/200?random=10" },
    { "id": 20, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "4 sec" },
    { "id": 21, "type": "image", "url": "https://picsum.photos/300/200?random=11" },
    { "id": 22, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 23, "type": "image", "url": "https://picsum.photos/300/200?random=12" },
    { "id": 24, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 25, "type": "image", "url": "https://picsum.photos/300/200?random=13" },
    { "id": 26, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 27, "type": "image", "url": "https://picsum.photos/300/200?random=14" },
    { "id": 28, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 29, "type": "image", "url": "https://picsum.photos/300/200?random=15" },
    { "id": 30, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" },
    { "id": 31, "type": "image", "url": "https://picsum.photos/300/200?random=16" },
    { "id": 32, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 33, "type": "image", "url": "https://picsum.photos/300/200?random=17" },
    { "id": 34, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "3 sec" },
    { "id": 35, "type": "image", "url": "https://picsum.photos/300/200?random=18" },
    { "id": 36, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "4 sec" },
    { "id": 37, "type": "image", "url": "https://picsum.photos/300/200?random=19" },
    { "id": 38, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 39, "type": "image", "url": "https://picsum.photos/300/200?random=20" },
    { "id": 40, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 41, "type": "image", "url": "https://picsum.photos/300/200?random=21" },
    { "id": 42, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 43, "type": "image", "url": "https://picsum.photos/300/200?random=22" },
    { "id": 44, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 45, "type": "image", "url": "https://picsum.photos/300/200?random=23" },
    { "id": 46, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 47, "type": "image", "url": "https://picsum.photos/300/200?random=24" },
    { "id": 48, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 49, "type": "image", "url": "https://picsum.photos/300/200?random=25" },
    { "id": 50, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" }
]


const page = () => {

    const [filterBy, setFilterBy] = useState('all');
    const [mediaData, setMediaData] = useState(data);

    const handleFilter = (value: string) => {
        if (value === 'all') {
            setFilterBy('all');
            setMediaData(data);
            return;
        }

        const filteredData = data.filter((data) => data.type === value);
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