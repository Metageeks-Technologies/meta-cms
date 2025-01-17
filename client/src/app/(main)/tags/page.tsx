"use client";
import { tagsdata } from '@/constant/tags';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import { setDefaultAutoSelectFamily } from 'net';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {

    const [tags, setTags] = useState([]);
    const {setLoading} = useUserContext();

    const fetchAllTags = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/all-tags`);
            
            console.log(resp, "response");
            if(resp.status === 200 || resp.status === 201){
                setTags(resp?.data)
            }else{
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllTags();
    }, []);



    return (
        <div className='p-2 sm:p-5 md:p-10'>

            <div className='w-full flex flex-row gap-0 sm:gap-2 flex-wrap'>
                {
                    tags.map((tag, index) => (
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