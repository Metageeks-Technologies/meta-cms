'use client'
import { usePostContext } from '@/context/postContext';
import { useUserContext } from '@/context/userContext';
import { MediaType } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import { debounce } from 'lodash';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



const page = () => {
    const [filterBy, setFilterBy] = useState('all');
    // const [mediaData, setMediaData] = useState(dummyMedia);

    const [page, setPage] = useState(1);
    const [lastId, setLastId] = useState('');
    const [image, setImage] = useState('');

    const { user, loading } = useUserContext();
    const { media, fetchMedia, hasMoreMedia } = usePostContext();

    // const handleFilter = (value: string) => {
    //     if (value === 'all') {
    //         setFilterBy('all');
    //         // setMediaData(dummyMedia);
    //         return;
    //     }

    //     // const filteredData = dummyMedia?.filter((data) => data.type === value);
    //     // setMediaData(filteredData);
    //     setFilterBy(value);
    // }


    // useEffect(() => {
    //     fetchMedia();
    // }, []);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 // Trigger 100px before the bottom
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener
    }, []);


    useEffect(() => {
        if (hasMoreMedia) fetchMedia(lastId);
    }, [page]);

    useEffect(() => {
        setLastId(media?.[media.length - 1]?._id || null);
    }, [media]);



    return (
        <Dialog>
            <div className='w-full px-2 py-10 sm:px-5 sm:py-10 md:p-10'>


                <div className='flex flex-row flex-wrap justify-center gap-3 my-10'>

                    {
                        media?.map((media: MediaType, index: number) => (
                            <DialogTrigger key={index} onClick={() => setImage(media.key)}>
                                <div key={media._id} className='w-80'>
                                    <img src={getURL(media.key)} alt="" loading='lazy' className='w-full h-full object-cover' />
                                </div>
                            </DialogTrigger>
                        ))
                    }
                </div>


                <DialogContent className="min-w-[800px] h-auto max-h-[80%] bg-gray-950 border-none p-0">
                    <DialogTitle></DialogTitle>
                    <img src={getURL(image)} alt="" className='w-full h-auto object-cover'/>
                </DialogContent>

                {
                    (hasMoreMedia && !loading) &&
                    <div aria-label="Loading..." role="status" className="flex items-center justify-center space-x-2">
                        <svg className="h-10 w-10 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                            <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="24"></line>
                            <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                            </line>
                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="24"></line>
                            <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                            </line>
                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="24"></line>
                            <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                            </line>
                        </svg>
                        <span className="text-xl font-medium text-gray-500">Loading...</span>
                    </div>
                }


            </div>
        </Dialog>
    )
}

export default page