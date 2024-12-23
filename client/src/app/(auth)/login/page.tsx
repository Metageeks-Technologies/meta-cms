'use client'
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {

    const router = useRouter()

    const [role, setRole] = useState('user');
    const [showPass, setShowPass] = useState(false);

    return (
        <div className='w-full h-screen flex items-center justify-center'>

            <div className='w-full max-w-[600px] mx-2 h-auto bg-gray-900 p-2 sm:p-6 rounded-lg'>

                <div className='my-2 sm:my-7 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold my-2 sm:my-5 text-white'>CMS</h1>
                    <h2>WELCOME BACK EXCLUSIVE MEMBER</h2>
                    <p>LOG IN TO CONTINUE</p>
                </div>

                <div className=''>
                    <div className='w-full flex'>
                        <p onClick={() => setRole('user')} className={`w-full text-center p-4 cursor-pointer text-xl ${role === 'user' ? " bg-gray-800 rounded-t-lg" : "    "}`}>User</p>
                        <p onClick={() => setRole('admin')} className={`w-full text-center p-4 cursor-pointer text-xl ${role === 'admin' ? " bg-gray-800 rounded-t-lg" : ""}`}>Admin</p>
                    </div>

                    <form className={`p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 ${role === 'user' ? "rounded-tr-lg" : "rounded-tl-lg"}`}>
                        <label className='flex flex-col gap-2'>
                            <span>Email</span>
                            <input type="email" required placeholder='Enter email id' className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg' />
                        </label>

                        <label className='flex flex-col gap-2'>
                            <span>Password</span>
                            <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>
                                <input type={showPass ? "text" : "password"} required placeholder='Enter password' className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg' />
                                <span onClick={() => setShowPass(!showPass)} className='pr-3'>
                                    {
                                        showPass ?
                                            <EyeOff />
                                            : <Eye />

                                    }
                                </span>
                            </div>
                        </label>

                        <button type='submit' className='w-full text-center bg-white text-black rounded-lg p-2 text-xl my-2 font-bold'>Login</button>
                        <p className='text-center my-3'>Don’t have an account? <span onClick={() => router.push('/signUp')} className='underline hover:text-blue-500 cursor-pointer'>Sign up</span></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page