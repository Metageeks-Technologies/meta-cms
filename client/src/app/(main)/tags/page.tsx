"use client";
import { tagsdata } from '@/constant/tags';
import React from 'react'

const page = () => {
    return (
        <div className='p-2 sm:p-5 md:p-10'>
            <h2 className='text-3xl md:text-5xl mt-2 mb-5 font-bold'>Tags</h2>

            <div className='w-full flex flex-row gap-0 sm:gap-2 flex-wrap'>
                {
                    tagsdata.map((tag, index) => (
                        <div key={index} className='text-nowrap text-sm sm:text-base p-2 border-[1px] border-gray-800 rounded-lg m-1 '>
                            <p>{tag}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page