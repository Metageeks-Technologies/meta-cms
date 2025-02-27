"use client"
import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import { getURL } from '@/utils/AWS_Config';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Image from 'next/image';


const CaseStudyPage = () => {
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
                toast.error(resp.data.message, { duration: 2000 });
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
        <div className="container mx-auto p-6 md:p-12">
            <div className="flex justify-between items-center mb-6">
                <button className="text-2xl" onClick={() => router.push('/allCaseStudy')}>
                    <FaArrowLeft />
                </button>
                {user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN ? (
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        onClick={() => router.push(`/editCaseStudy/${slug}`)}>
                        <MdEdit /> Edit
                    </button>
                ) : null}
            </div>

            <div className="space-y-8">

                <section className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Project Type : <span>{caseStudyPage?.projectType}</span></h2>

                </section>


                {/* Hero Section */}
                <section className="bg-gray-900 rounded-lg overflow-hidden">
                    <h2 className="text-3xl font-bold text-white p-6">Hero Section</h2>
                    <Image
                        src={getURL(caseStudyPage?.content?.heroSection?.imageKey)}
                        alt="Hero Section"
                        className="w-full object-cover"
                        layout="responsive"
                        width={1200}
                        height={320}
                    />
                </section>

                {/* About Section */}
                <section className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">About Section</h2>
                    <div className="text-gray-400 mb-6">
                        <p>
                            <span className="font-semibold text-white">Heading: </span>
                            {caseStudyPage?.content?.aboutSection?.heading}
                        </p>
                        <p>
                            <span className="font-semibold text-white">Description: </span>
                            {caseStudyPage?.content?.aboutSection?.description}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {caseStudyPage?.content?.aboutSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400">
                                    <span className="font-semibold text-white">Heading: </span>
                                    {card?.heading}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-semibold text-white">Description: </span>
                                    {card?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* UI Section 1 */}
                <section className="bg-gray-900 rounded-lg overflow-hidden">
                    <h2 className="text-3xl font-bold text-white p-6">UI Section 1</h2>
                    <Image
                        src={getURL(caseStudyPage?.content?.uiSection?.imageKey)}
                        alt="UI Section 1"
                        className="w-full object-cover"
                        layout="responsive"
                        width={1200}
                        height={320}
                    />
                </section>

                {/* Service Section */}
                <section className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Services Section</h2>
                    <p className="text-gray-400 mb-6">
                        <span className="font-semibold text-white">Description: </span>
                        {caseStudyPage?.content?.serviceSection?.description}
                    </p>

                    <Image
                        src={getURL(caseStudyPage?.content?.serviceSection?.imageKey)}
                        alt="Service Section"
                        className="w-full object-cover"
                        layout="responsive"
                        width={1200}
                        height={320}
                    />
                </section>

                {/* Process Section */}
                <section className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Process Section</h2>
                    <p className="text-gray-400 mb-6">
                        <span className="font-semibold text-white">Heading: </span>
                        {caseStudyPage?.content?.processSection?.heading}
                    </p>
                    <div className="space-y-5">
                        {caseStudyPage?.content?.processSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400">
                                    <span className="font-semibold text-white">Heading: </span>
                                    {card?.heading}
                                </p>
                                <ul className="list-disc pl-6">
                                    {card?.list?.map((point: any, idx: any) => (
                                        <li key={idx} className="text-gray-400">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* UI Section 2 */}
                <section className="bg-gray-900 rounded-lg overflow-hidden">
                    <h2 className="text-3xl font-bold text-white p-6">UI Section 2</h2>
                    <Image
                        src={getURL(caseStudyPage?.content?.uiSection2?.imageKey)}
                        alt="UI Section 2"
                        className="w-full object-cover"
                        layout="responsive"
                        width={1200}
                        height={320}
                    />

                </section>

                {/* Challenges Section */}
                <section className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Challenges Section</h2>
                    <p className="text-gray-400 mb-6">
                        <span className="font-semibold text-white">Heading: </span>
                        {caseStudyPage?.content?.challengesSection?.heading}
                    </p>
                    <p className="text-gray-400 mb-6">
                        <span className="font-semibold text-white">Description: </span>
                        {caseStudyPage?.content?.challengesSection?.description}
                    </p>

                    <div className="space-y-5">
                        {caseStudyPage?.content?.challengesSection?.cards?.map((card: any, index: any) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400">
                                    <span className="font-semibold text-white">Heading: </span>
                                    {card?.heading}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-semibold text-white">Description: </span>
                                    {card?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CaseStudyPage;
