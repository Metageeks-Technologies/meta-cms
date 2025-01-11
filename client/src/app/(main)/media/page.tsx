'use client'
import { usePostContext } from '@/context/postContext';
import { useUserContext } from '@/context/userContext';
import { MediaType } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [filterBy, setFilterBy] = useState('all');
    // const [mediaData, setMediaData] = useState(dummyMedia);

    const {user} = useUserContext();
    const { media, fetchMedia } = usePostContext();

    const handleFilter = (value: string) => {
        if (value === 'all') {
            setFilterBy('all');
            // setMediaData(dummyMedia);
            return;
        }

        // const filteredData = dummyMedia?.filter((data) => data.type === value);
        // setMediaData(filteredData);
        setFilterBy(value);
    }


    useEffect(() => {
        if(user.role) fetchMedia();
    }, [user]);

    return (
        <div className='px-2 py-10 sm:px-5 sm:py-10 md:p-10'>


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