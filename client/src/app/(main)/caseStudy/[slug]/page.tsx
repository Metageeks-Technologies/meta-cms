"use client"
import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import { getURL } from '@/utils/AWS_Config';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaArrowLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const page = () => {
    const { setLoading, user } = useUserContext();
    const [caseStudyPage, setcaseStudyPage] = useState<any>(null);
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const fetchPage = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/private/${slug}`);

            if (resp.status === 200 || resp.status === 201) {
                setcaseStudyPage(resp?.data);
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


            <div className='flex flex-col gap-5'>
                {/* Hero Section */}
                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>Hero Section</h2>
                        <img src={getURL(caseStudyPage?.heroSection?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>

                {/* About Section */}
                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>About Section</h2>
                        <p className='text-gray-400'>
                            <span className='font-bold text-white'>Heading: </span>
                            {caseStudyPage?.aboutSection?.heading}
                        </p>
                        <p className='text-gray-400'>
                            <span className='font-bold text-white'>Description: </span>
                            {caseStudyPage?.aboutSection?.description}
                        </p>
                    </div>
                    <div className='w-full flex flex-row gap-5'>
                        <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                        <div className='w-full flex flex-col gap-5'>
                            {caseStudyPage?.aboutSection?.cards?.map((card: any, index: any) => (
                                <div key={index} className='w-full'>
                                    <p className='text-gray-400'>
                                        <span className='font-bold text-white'>Heading: </span>
                                        {card?.heading}
                                    </p>
                                    <p className='text-gray-400'>
                                        <span className='font-bold text-white'>Description: </span>
                                        {card?.description}
                                    </p>
                                    <img src={getURL(card?.imageKey)} className='w-full h-full object-contain' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* UI Section 1 */}
                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>UI Section 1</h2>
                        <img src={getURL(caseStudyPage?.uiSection1?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>

                {/* Service Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Services Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.serviceSection?.heading}
                    </p>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Description: </span>
                        {caseStudyPage?.serviceSection?.description}
                    </p>
                    <img src={getURL(caseStudyPage?.serviceSection?.imageKey)} className='w-full h-full object-contain' />
                </div>

                {/* Process Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Process Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.processSection?.heading}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {caseStudyPage?.processSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className='w-full'>
                                <p className='text-gray-400'>
                                    <span className='font-bold text-white'>Heading: </span>
                                    {card?.heading}
                                </p>
                                <div className='w-full flex flex-col gap-3'>
                                    {card?.list?.map((point: any, idx: any) => (
                                        <p key={idx} className='text-gray-400'>
                                            - {point?.point}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UI Section 2 */}
                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>UI Section 2</h2>
                        <img src={getURL(caseStudyPage?.uiSection2?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>

                {/* Challenges Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Challenges Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.challengesSection?.heading}
                    </p>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Description: </span>
                        {caseStudyPage?.challengesSection?.description}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {caseStudyPage?.challengesSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className='w-full'>
                                <p className='text-gray-400'>
                                    <span className='font-bold text-white'>Heading: </span>
                                    {card?.heading}
                                </p>
                                <p className='text-gray-400'>
                                    <span className='font-bold text-white'>Description: </span>
                                    {card?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page