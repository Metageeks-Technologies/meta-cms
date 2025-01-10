'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CreatePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: 'write your content here'
    });

    const handleChange = (e:any) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleEditorChange = (value:any) => {
        setFormData((prev) => ({
            ...prev,
            content: value
        }));
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 sm:px-8 md:px-12 lg:px-16">
            <h1 className='text-center text-4xl mb-5 mt-5'>Create Page</h1>

            <form onSubmit={handleSubmit}>
            <label className='w-full flex flex-col gap-2 mb-5'>
            <span>Title</span>

            <input
                    type="text"
                    className='w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none'
                    id='title'
                    value={formData.title}
                    onChange={handleChange}
                />
                          </label>



<label className='w-full flex flex-col gap-2 mb-5'>
            <span>Enter Slug</span>
            <span className='text-xs italic text-gray-400 -mt-3'>(Contain only lowercase letters, numbers, hyphens, and underscores)</span>
            <input
              type="text"
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
                    language="javascript" // Change this to your desired default language
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
