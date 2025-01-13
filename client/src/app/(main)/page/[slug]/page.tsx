"use client"
import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaArrowLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const page = () => {
    const { setLoading, user } = useUserContext();
    const [pageData, setPageData] = useState<any>(null);

    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const fetchPage = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/private/${slug}`);

            if (resp.status === 200 || resp.status === 201) {
                setPageData(resp?.data);
                // console.log(resp);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.role) fetchPage();
    }, [user]);

    return (
        <div className='p-4 md:p-10' >
            <div className='mb-5 flex flex-row items-center justify-between'>
                <button className='rounded-full text-2xl' onClick={() => router.back()}>
                    <FaArrowLeft />
                </button>
                {
                    user.role === userRoles.SUPERADMIN &&
                    <button className='bg-white py-2 px-4 rounded-lg text-black font-bold flex flex-row items-center gap-2' onClick={() => router.push(`/editPage/${slug}`)}>
                        <MdEdit /> Edit
                    </button>
                }
            </div>
            <div dangerouslySetInnerHTML={{ __html: pageData?.content }}></div>
        </div>
    )
}

export default page