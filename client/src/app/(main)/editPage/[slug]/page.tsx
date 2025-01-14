'use client';
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import axiosCall from '@/utils/ApiCall';
import { useUserContext } from '@/context/userContext';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";

const EditPage = () => {
    const router = useRouter();

    const { setLoading, user } = useUserContext();
    const params = useParams();
    const slug = params.slug;

    const [formData, setFormData] = useState<any>({
        title: "",
        slug: "",
        content: ""
    });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleEditorChange = (value: string | undefined) => {
        setFormData((prev: any) => ({
            ...prev,
            content: value
        }));
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error("title is required", { duration: 2000 });
            return
        }

        if (!formData.slug) {
            toast.error("slug is required", { duration: 2000 });
            return
        }

        if (formData.slug.trim().length < 3) {
            toast.error('Add atleast 3 character in slug.', { duration: 2000 });
            return;
        }

        if (!formData.content) {
            toast.error("content is required", { duration: 2000 });
            return
        }

        setLoading(true);
        try {
            const payload = {
                title: formData?.title,
                slug: formData?.slug,
                content: formData?.content
            }
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${formData?._id}`, payload);

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                setFormData({
                    title: "",
                    slug: "",
                    content: ""
                });
                router.back();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };



    const fetchPage = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/private/${slug}`);

            if (resp.status === 200 || resp.status === 201) {
                setFormData(resp?.data);
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
    }, []);


    return (
        <div className="min-h-screen mt-10 text-white px-6 sm:px-8 md:px-12 lg:px-16">

            <div className='text-2xl cursor-pointer text-white -mt-2 mb-5' onClick={() => router.back()}>
                <FaArrowLeft />
            </div>

            <form onSubmit={handleSubmit}>
                <label className='w-full flex flex-col gap-2 mb-5'>
                    <span>Title</span>

                    <input
                        type="text"
                        className='w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none'
                        id='title'
                        placeholder='Enter title'
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>



                <label className='w-full flex flex-col gap-2 mb-5'>
                    <span>Enter Slug</span>
                    <span className='text-xs italic text-gray-400 -mt-3'>(Contain only lowercase letters, numbers, hyphens, and underscores)</span>
                    <input
                        type="text"
                        id='slug'
                        className='w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none'
                        placeholder='Enter slug'
                        value={formData.slug}
                        onChange={handleChange}
                    />
                </label>


                <label className="block text-sm font-medium text-gray-300 mb-5" >
                    <span>Enter content</span>

                    <Editor
                        height="50vh"
                        theme='vs-dark'
                        language="html" // Change this to your desired default language
                        value={formData.content}
                        onChange={handleEditorChange}
                    />
                </label>

                <button
                    type="submit"
                    className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Update Page
                </button>
            </form>
        </div>
    );
};

export default EditPage;
