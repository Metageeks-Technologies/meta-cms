'use client'
import { LoginPayload } from '@/types';
import axiosCall from '@/utils/ApiCall';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
const page = () => {
    const router = useRouter()
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);

            const payload: LoginPayload = { email, password };
            const response = await axiosCall('POST', `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, payload);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message, { duration: 2000 });
                router.push('/dashboard');
            } else {
                toast.error(response.data.message, { duration: 2000 });
            }

            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { duration: 2000 });
        }
    }
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='w-full max-w-[600px] mx-2 h-auto bg-gray-900 p-2 sm:p-6 rounded-lg'>
                <div className='my-2 sm:my-7 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold my-2 sm:my-5 text-white'>CMS</h1>
                    <h2>WELCOME BACK EXCLUSIVE MEMBER</h2>
                    <p>LOG IN TO CONTINUE</p>
                </div>
                <div className=''>
                    <form onSubmit={handleLogin} className="p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 rounded-tl-lg">
                        <label className='flex flex-col gap-2'>
                            <span>Email</span>
                            <input
                                type="email"
                                required
                                placeholder='Enter email id'
                                className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label className='flex flex-col gap-2'>
                            <span>Password</span>
                            <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>
                                <input
                                    type={showPass ? "text" : "password"}
                                    required placeholder='Enter password'
                                    className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span onClick={() => setShowPass(!showPass)} className='pr-3 cursor-pointer'>
                                    {
                                        showPass ?
                                            <EyeOff />
                                            : <Eye />
                                    }
                                </span>
                            </div>
                        </label>
                        <button type='submit' disabled={loading && true} className='w-full text-center bg-white text-black rounded-lg p-2 text-xl my-2 font-bold'>{loading ? "loading..." : "Login"}</button>
                        <p className='text-center my-3'>Don’t have an account? <span onClick={() => router.push('/signUp')} className='underline hover:text-blue-500 cursor-pointer'>Sign up</span></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default page






