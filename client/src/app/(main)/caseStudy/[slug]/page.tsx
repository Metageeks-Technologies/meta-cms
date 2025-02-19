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
    const { setLoading, user, websiteKey } = useUserContext();
    const [caseStudyPage, setCaseStudyPage] = useState<any>(null);


    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const fetchCaseStudy = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/caseStudy/${slug}`, undefined, { websiteKey });

            if (resp.status === 200 || resp.status === 201) {
                setCaseStudyPage(resp?.data);
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
        if (websiteKey) fetchCaseStudy();
    }, [websiteKey]);

    return (
        <div className='p-4 md:p-10' >
            <div className='mb-5 flex flex-row items-center justify-between'>
                <button className='rounded-full text-2xl' onClick={() => router.back()}>
                    <FaArrowLeft />
                </button>
                {
                    (user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN) &&
                    <button className='bg-white py-2 px-4 rounded-lg text-black font-bold flex flex-row items-center gap-2' onClick={() => router.push(`/editPage/${slug}`)}>
                        <MdEdit /> Edit
                    </button>
                }
            </div>

            <div className='flex flex-col gap-5'>
                {/* Hero Section */}
                <div className='w-full flex flex-col gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Hero Section</h2>
                    <img src={getURL(caseStudyPage?.content?.heroSection?.imageKey)} className='w-full max-w-[300px] h-full object-contain' />
                </div>

                {/* About Section */}
                <div className='w-full flex flex-col gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>About Section</h2>
                        <p className='text-gray-400'>
                            <span className='font-bold text-white'>Heading: </span>
                            {caseStudyPage?.content?.aboutSection?.heading}
                        </p>
                        <p className='text-gray-400'>
                            <span className='font-bold text-white'>Description: </span>
                            {caseStudyPage?.content?.aboutSection?.description}
                        </p>
                    </div>
                    <div className='w-full flex flex-col gap-5'>
                        <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                        <div className='w-full flex flex-col gap-5'>
                            {caseStudyPage?.content?.aboutSection?.cards?.map((card: any, index: any) => (
                                <div key={index} className='w-full'>
                                    <p className='text-gray-400'>
                                        <span className='font-bold text-white'>Heading: </span>
                                        {card?.heading}
                                    </p>
                                    <p className='text-gray-400'>
                                        <span className='font-bold text-white'>Description: </span>
                                        {card?.description}
                                    </p>
                                    <img src={getURL(card?.imageKey)} className='w-full max-w-[300px] h-full object-contain' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* UI Section 1 */}
                <div className='w-full flex flex-col gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>UI Section 1</h2>
                    <img src={getURL(caseStudyPage?.content?.uiSection?.imageKey)} className='w-full max-w-[300px] h-full object-contain' />
                </div>

                {/* Service Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Services Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.content?.serviceSection?.heading}
                    </p>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Description: </span>
                        {caseStudyPage?.content?.serviceSection?.description}
                    </p>
                    <img src={getURL(caseStudyPage?.content?.serviceSection?.imageKey)} className='w-full max-w-[300px] h-full object-contain' />
                </div>

                {/* Process Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Process Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.content?.processSection?.heading}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {caseStudyPage?.content?.processSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className='w-full'>
                                <p className='text-gray-400'>
                                    <span className='font-bold text-white'>Heading: </span>
                                    {card?.heading}
                                </p>
                                <div className='w-full flex flex-col gap-3'>
                                    {card?.list?.map((point: any, idx: any) => (
                                        <p key={idx} className='text-gray-400'>
                                            - {point}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UI Section 2 */}
                <div className='w-full flex flex-col gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>UI Section 2</h2>
                    <img src={getURL(caseStudyPage?.content?.uiSection2?.imageKey)} className='w-full max-w-[300px] h-full object-contain' />
                </div>

                {/* Challenges Section */}
                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Challenges Section</h2>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Heading: </span>
                        {caseStudyPage?.content?.challangesSection?.heading}
                    </p>
                    <p className='text-gray-400'>
                        <span className='font-bold text-white'>Description: </span>
                        {caseStudyPage?.content?.challangesSection?.description}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {caseStudyPage?.content?.challangesSection?.cards?.map((card: any, index: any) => (
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

export default page;
