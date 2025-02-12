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
    const [pageData, setPageData] = useState<any>(null);


    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const fetchPage = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/private/${slug}`, undefined, { websiteKey });

            if (resp.status === 200 || resp.status === 201) {
                setPageData(resp?.data);
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
                    (user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN) &&
                    <button className='bg-white py-2 px-4 rounded-lg text-black font-bold flex flex-row items-center gap-2' onClick={() => router.push(`/editPage/${slug}`)}>
                        <MdEdit /> Edit
                    </button>
                }
            </div>


            <div className='flex flex-col gap-5'>

                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>Hero Section</h2>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Sub Heading : </span>
                            {pageData?.content.heroSection?.subHeading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                            {pageData?.content.heroSection?.heading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                            {pageData?.content.heroSection?.description}
                        </p>
                    </div>
                    <div className='h-[250px] max-w-[40%]'>
                        <img src={getURL(pageData?.content.heroSection?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>


                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>Solutin Section 1</h2>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Sub Heading : </span>
                            {pageData?.content.solutionSection1?.subHeading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                            {pageData?.content.solutionSection1?.heading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                            {pageData?.content.solutionSection1?.description}
                        </p>
                    </div>
                    <div className='h-[250px] max-w-[40%]'>
                        <img src={getURL(pageData?.content.solutionSection1?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>


                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Services Section</h2>

                    <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                        {pageData?.content.servicesSection?.heading}
                    </p>
                    <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                        {pageData?.content.servicesSection?.description}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {
                            pageData?.content.servicesSection?.cards?.map((card: any, index: any) => (
                                <div key={index} className='w-full flex flex-row gap-5 justify-between'>
                                    <div className='w-full'>
                                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                                            {card?.heading}
                                        </p>
                                        <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                                            {card?.description}
                                        </p>
                                    </div>

                                    <div className='h-[100px] mx-auto'>
                                        <img src={getURL(card?.imageKey)} className='w-full h-full object-contain' />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>



                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Process Section</h2>

                    <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                        {pageData?.content.processSection?.heading}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {
                            pageData?.content.servicesSection?.cards?.map((card: any, index: any) => (
                                <div key={index} className='w-full'>
                                    <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                                        {card?.heading}
                                    </p>
                                    <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                                        {card?.description}
                                    </p>
                                </div>
                            ))
                        }
                    </div>

                </div>



                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>Solutin Section 2</h2>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Sub Heading : </span>
                            {pageData?.content.solutionSection2?.subHeading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                            {pageData?.content.solutionSection2?.heading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                            {pageData?.content.solutionSection2?.description}
                        </p>
                    </div>
                    <div className='h-[250px] max-w-[40%]'>
                        <img src={getURL(pageData?.content.solutionSection2?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>


                <div className='w-full bg-gray-900 rounded-lg p-4'>
                    <h2 className='text-2xl font-bold my-2'>Features Section</h2>

                    <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                        {pageData?.content.featureSection?.heading}
                    </p>

                    <h3 className='text-lg font-bold my-2 mt-5'>Cards</h3>
                    <div className='w-full flex flex-col gap-5'>
                        {
                            pageData?.content.featureSection?.features?.map((card: any, index: any) => (
                                <div key={index} className='w-full flex flex-row gap-5 justify-between'>
                                    <div className='w-full'>
                                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                                            {card?.heading}
                                        </p>
                                        <p className='text-gray-400'> <span className='font-bold text-white'>Description : </span>
                                            {card?.description}
                                        </p>
                                    </div>

                                    <div className='h-[100px] mx-auto'>
                                        <img src={getURL(card?.imageKey)} className='w-full h-full object-contain' />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

                <div className='w-full flex flex-row gap-5 justify-between bg-gray-900 rounded-lg p-4'>
                    <div>
                        <h2 className='text-2xl font-bold my-2'>Market Forecast Section</h2>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Sub Heading : </span>
                            {pageData?.content.marketForecastSection?.subHeading}
                        </p>
                        <p className='text-gray-400'> <span className='font-bold text-white'>Heading : </span>
                            {pageData?.content.marketForecastSection?.heading}
                        </p>
                        <ul className='list-inside list-disc'>
                            {
                                pageData?.content.marketForecastSection?.list?.map((item: any, index: any) => (
                                    <li key={index}>{item.point}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className='h-[250px] max-w-[40%]'>
                        <img src={getURL(pageData?.content.marketForecastSection?.imageKey)} className='w-full h-full object-contain' />
                    </div>
                </div>


            </div>
        </div>
    )
}

export default page