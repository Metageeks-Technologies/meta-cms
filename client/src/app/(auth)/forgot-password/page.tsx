'use client';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
// Adjust the import path according to your project structure

const ForgotPasswordPage = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const { setLoading } = useUserContext();

    const handleSendToken = async () => {
        setLoading(true);
        try {
            const response = await axiosCall(
                'POST',
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/generate-reset-password-token`,
                { email },
            );
            //   console.log(response)
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response.data.message);
                setIsEmailSent(true);
            } else {
                toast.error(response?.data?.message || 'An error occurred');
            }
        } catch (err) {
            toast.error('Failed to send reset token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosCall(
                'POST',
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
                { token, password: newPassword },
            );
            //   console.log(response)
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response.data.message);
                router.push('/login');
            } else {
                toast.error(response?.data?.message || 'An error occurred');
            }
        } catch (err) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-full max-w-[600px] mx-2 h-auto bg-gray-900 p-2 sm:p-6 rounded-lg">
                <div className="my-2 sm:my-7 text-center">
                    <h1 className="text-4xl font-semibold text-white">
                        Forgot Password
                    </h1>
                </div>
                <div>
                    {!isEmailSent ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendToken();
                            }}
                            className="p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 rounded-tl-lg"
                        >
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-300">
                                    Enter your email
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-gray-200 text-black hover:text-white rounded-lg p-2 text-xl my-2 font-bold hover:bg-transparent border-white border-2 duration-300"
                            >
                                Send Reset Token
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleResetPassword();
                            }}
                            className="p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 rounded-tl-lg"
                        >
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-300">
                                    Enter token
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter the token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-300">
                                    New Password
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <div className="w-full bg-gray-700 rounded-lg flex items-center">
                                    <input
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                    />
                                    <span
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                        className="pr-3 cursor-pointer text-gray-300"
                                    >
                                        {showNewPassword ? <EyeOff /> : <Eye />}
                                    </span>
                                </div>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-300">
                                    Confirm Password
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <div className="w-full bg-gray-700 rounded-lg flex items-center">
                                    <input
                                        type={showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        placeholder="Enter Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                    />
                                    <span
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="pr-3 cursor-pointer text-gray-300"
                                    >
                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                    </span>
                                </div>
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-gray-200 text-black hover:text-white rounded-lg p-2 text-xl my-2 font-bold hover:bg-transparent border-white border-2 duration-300"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
