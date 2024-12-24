'use client'
import { SignUpFormData, SignUpPayload } from '@/types';
import axiosCall from '@/utils/ApiCall';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {

  const router = useRouter();

  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [passError, setPassError] = useState<string>('');




  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });



  const handleSignUp = async(e: any) => {

    e.preventDefault();

    if(formData.password !== formData.confirmPassword){
      toast.error("Password must be same", {
        duration: 2000,
      })
      return;
    }

    if(!isValidPassword(formData.password)){
      setPassError('Password must contain atleast one lowercase letter, one uppercase letter, one digit and one special character');
      return;
    }

    try {
      const paylaod: SignUpPayload = {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      const response = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}auth/signUp`, paylaod);

      if(response){
        toast.success(response.message + ", please login",{
          duration: 2000,
        })

        router.push('/login');
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        duration: 200,
    });
    }
  }


  function isValidPassword(password: string) {
    const hasUppercase = /[A-Z]/.test(password); 
    const hasLowercase = /[a-z]/.test(password); 
    const hasDigit = /\d/.test(password);       
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); 
    return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
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
          <div className='w-full flex'>
            <p onClick={() => setRole('user')} className={`w-full text-center p-4 cursor-pointer text-xl ${role === 'user' ? " bg-gray-800 rounded-t-lg" : "    "}`}>User</p>
            <p onClick={() => setRole('admin')} className={`w-full text-center p-4 cursor-pointer text-xl ${role === 'admin' ? " bg-gray-800 rounded-t-lg" : ""}`}>Admin</p>
          </div>

          <form onSubmit={handleSignUp} className={`p-4 bg-gray-800 flex flex-col gap-5 rounded-b-lg pt-10 ${role === 'user' ? "rounded-tr-lg" : "rounded-tl-lg"}`}>

            <div className='w-full flex flex-row items-center gap-5'>

              <label className='w-full flex flex-col gap-2'>
                <span>First Name</span>
                <input
                  type="text"
                  required
                  placeholder='Enter first name'
                  className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </label>


              <label className='w-full flex flex-col gap-2'>
                <span>Last Name</span>
                <input
                  type="text"
                  placeholder='Enter last name'
                  className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </label>

            </div>

            <label className='flex flex-col gap-2'>
              <span>Email</span>
              <input
                type="email"
                required
                placeholder='Enter email id'
                className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>

            <div className='w-full flex flex-row items-center gap-5'>
              <label className='w-full flex flex-col gap-2'>
                <span>Password</span>
                <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder='Enter password'
                    className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <span>Confirm Password</span>
                <div className='w-full bg-gray-700 rounded-lg flex flex-row items-center'>

                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder='Confirm password'
                    className='w-full bg-gray-700 px-4 py-3 outline-none rounded-lg'
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            <button type='submit' disabled={loading && true} className='w-full text-center bg-white text-black rounded-lg p-2 text-xl my-2 font-bold'>{loading? "Loading..." : "Sign Up"}</button>
            <p className='text-center my-3'>Already have an account? <span onClick={() => router.push('/login')} className='underline hover:text-blue-500 cursor-pointer'>Log in</span></p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default page