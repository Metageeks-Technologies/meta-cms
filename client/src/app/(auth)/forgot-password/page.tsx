'use client';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
// Adjust the import path according to your project structure

const ForgotPasswordPage = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpTimer, setOtpTimer] = useState(90); 
    const [otpExpired, setOtpExpired] = useState(false);


    const [passwordMatch, setPasswordMatch] = useState(false);
    const router = useRouter();
    const { setLoading } = useUserContext();

    const handleSendToken = async () => {
        setLoading(true);
        try {
            const response = await axiosCall(
                'POST',
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/send-reset-password-otp`,
                { email },
            );

            if (response?.status === 200 || response?.status === 201) {
                toast.success(response.data.message);
                setIsEmailSent(true);
                setOtpExpired(false); // Reset expired status when sending OTP
                setOtpTimer(90); // Reset timer
            } else {
                toast.error(response?.data?.message || 'An error occurred');
            }
        } catch (err) {
            toast.error('Failed to send reset token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        handleSendToken();
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            // Show error message inline if passwords don't match
            setPasswordMatch(false);
            return;
        }

        // if (newPassword !== confirmPassword) {
        //     toast.error('Passwords do not match');
        //     return;
        // }
        setLoading(true);
        try {
            const response = await axiosCall(
                'POST',
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
                { email, otp , password: newPassword },
            );
            
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response.data.message);
                router.push('/login');
            } else {
                toast.error(response?.data?.message || 'An error occurred');
            }
            // setPasswordMatch(true)
        } catch (err) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const confirmPwd = e.target.value;
        setConfirmPassword(confirmPwd);
        // Check if the passwords match
        setPasswordMatch(newPassword === confirmPwd);
    };

    useEffect(() => {
        let timer:any;
        if (otpTimer > 0 && !otpExpired) {
            timer = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            setOtpExpired(true);
        }
        return () => clearInterval(timer); // Cleanup on unmount
    }, [otpTimer, otpExpired]);

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
                                    Enter Email
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <input
                                    type="email"
                                    required
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-gray-200 text-black hover:text-white rounded-lg p-2 text-xl my-2 font-bold hover:bg-transparent border-white border-2 duration-300"
                            >
                                Send OTP
                            </button>
                            <div className="flex items-center">
    <a
        href="/login"
        className="text-gray-300 hover:text-gray-600 flex items-center"
    >
        <MdOutlineKeyboardBackspace className='w-8 h-8' />
        <span className="ml-2">Back to Login</span>
    </a>
</div>

                        </form>
                    ) : (
                        <form
                            onSubmit={handleResetPassword}
                            className="p-4 bg-gray-800 flex flex-col gap-3 rounded-b-lg pt-10 rounded-tl-lg"
                        >
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-300">
                                    Enter OTP
                                    <sup className="text-red-500">*</sup>
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="One Time Password"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                />
                            </label>
                            <div className="flex justify-end ">
    {!otpExpired ? (
        <p className="text-gray-300">{`Resend OTP: ${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')}`}</p>
    ) : (
        <button
            type="button"
            onClick={handleResendOtp}
            className=" bg-gray-200 text-black hover:text-white rounded-lg px-2 text-sm   hover:bg-transparent border-white border-2 duration-300"
        >
            Resend OTP
        </button>
    )}
</div>
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
                                        placeholder="New password"
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
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange} // Update the password match status
                                        className="w-full bg-gray-700 px-4 py-3 outline-none rounded-lg text-gray-300"
                                    />
                                    <span
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="pr-3 cursor-pointer text-gray-300"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff />
                                        ) : (
                                            <Eye />
                                        )}
                                    </span>
                                </div>

                                {/* Password match message */}
                                {confirmPassword && (
                                    <p
                                        className={`mt-1 text-sm ${
                                            passwordMatch
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {passwordMatch
                                            ? 'Passwords match'
                                            : 'Passwords do not match'}
                                    </p>
                                )}
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
