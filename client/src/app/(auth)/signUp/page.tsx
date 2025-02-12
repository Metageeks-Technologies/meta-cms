'use client'
import { SignUpFormData, SignUpPayload } from '@/types';
import axiosCall from '@/utils/ApiCall';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { isValidPassword, isValidString } from '@/utils/helperFunction';
import { useUserContext } from '@/context/userContext';

const page = () => {
  const { setLoading } = useUserContext();

  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState<string>('');

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });



  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (value === "") {
      setFormData({ ...formData, fullName: "" });
      return
    }
    if (isValidString(value) && value.length <= 26) {
      setFormData({ ...formData, fullName: e.target.value });
    }
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError(false);
    const {value} = e.target;
    setFormData({ ...formData, email: value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value.length < 32) {
      setFormData({ ...formData, [name]: e.target.value });
    }
  }



  const handleSignUp = async (e: any) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(formData.email)) {
      setEmailError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password must be same", {
        duration: 2000,
      })
      return;
    }

    if (!isValidPassword(formData.password)) {
      setPassError('Password must be 8+ characters, including 1 lowercase, 1 uppercase, 1 digit, and 1 special character.');
      return;
    }

    setLoading(true);
    try {
      const paylaod: SignUpPayload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      }

      const response = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signUp`, paylaod);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message + ", please login", { duration: 2000, });

        router.push('/login');
      } else {
        toast.error(response.data.message, { duration: 2000, })
      }

    } catch (error) {
      console.log(error);
      toast.error("Something ", {
        duration: 200,
      });
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-full max-w-[600px] h-auto bg-gray-900 p-2 sm:p-6 mx-2 rounded-lg'>

        <div className='my-7 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold my-2 sm:my-5 text-white'>CMS</h1>
          <h2>WELCOME TO OUR EXCLUSIVE COMMUNITY</h2>
          <p>SIGN UP TO GET STARTED</p>
        </div>

        <div className=''>

          <form onSubmit={handleSignUp} className={`p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 `}>

            <label className='w-full flex flex-col gap-2'>
              <span>Full Name<sup className='text-red-500'>*</sup></span>
              <input
                type="text"
                name='fullName'
                value={formData.fullName}
                required
                placeholder='Enter Full Name'
                className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                onChange={handleNameChange}
              />
            </label>

            <label className='flex flex-col gap-2'>
              <span>Email<sup className='text-red-500'>*</sup></span>
              <input
                type="text"
                name='email'
                value={formData.email}
                // required
                placeholder='Enter Email'
                className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                onChange={(e) => handleChangeEmail(e)}
              />
            </label>
            {
              emailError &&
              <p className='text-red-500 text-sm -mt-3'>Invaild Email Id</p>
            }

            <div className='w-full flex flex-row items-center gap-5'>
              <label className='w-full flex flex-col gap-2'>
                <span>Password<sup className='text-red-500'>*</sup></span>
                <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>
                  <input
                    type={showPass ? "text" : "password"}
                    name='password'
                    value={formData.password}
                    required
                    placeholder='Enter Password'
                    className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                    onChange={handlePasswordChange}
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

              <label className='w-full flex flex-col gap-2'>
                <span>Confirm Password<sup className='text-red-500'>*</sup></span>
                <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>

                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name='confirmPassword'
                    required
                    value={formData.confirmPassword}
                    placeholder='Confirm Password'
                    className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                    onChange={handlePasswordChange}
                  />

                  <span onClick={() => setShowConfirmPass(!showConfirmPass)} className='pr-3 cursor-pointer'>
                    {
                      showConfirmPass ?
                        <EyeOff />
                        : <Eye />
                    }
                  </span>
                </div>
              </label>

            </div>
            {
              passError &&
              <p className='text-xs text-red-500 -mt-3'>{passError}</p>
            }

            <button type='submit' className='w-full text-center bg-gray-200 text-black hover:text-white rounded-lg p-2 text-xl my-2 font-bold hover:bg-transparent border-white border-2 duration-300'>Sign Up</button>
            <p className='text-center my-3'>Already have an account? <span onClick={() => router.push('/login')} className='underline text-blue-500 cursor-pointer'>Log in</span></p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default page