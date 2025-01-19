'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import axiosCall from '@/utils/ApiCall';
import { INITIAL_PAGE_CONTENT } from '@/constant/page';
import { duration } from 'moment';
import { useUserContext } from '@/context/userContext';

const CreatePage = () => {

    const { setLoading } = useUserContext();

    const [formData, setFormData] = useState(INITIAL_PAGE_CONTENT);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
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

        if (!formData.title.trim()) {
            toast.error("title is required", { duration: 2000 });
            return
        }

        if (!formData.slug.trim()) {
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
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/pages`, formData);

            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                setFormData(INITIAL_PAGE_CONTENT);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-10 text-white px-6 sm:px-8 md:px-12 lg:px-16">

            <form onSubmit={handleSubmit}>
                <label className='w-full flex flex-col gap-2 mb-5'>
                    <span>Title</span>

                    <input
                        type="text"
                        className='w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none'
                        id='title'
                        placeholder='Enter title'
                        value={formData.title}
                        maxLength={120}
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
                    Create Page
                </button>
            </form>
        </div>
    );
};

export default CreatePage;
