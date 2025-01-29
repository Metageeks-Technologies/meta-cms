'use client'
import React from 'react'
import { BsCart2 } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { AiOutlineFileProtect } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';

const CardRow = () => {

  const { user } = useUserContext();

  return (
    <div className="mx-auto p-4 flex flex-wrap "
>

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto  cursor-pointer" >
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'
           
>
          <p>Total Orders</p>
          <BsCart2 className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>100</p>
      </div>

      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto cursor-pointer" 
>
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Customers</p>
            <FaUsers className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>100</p>
        </div>
      }

      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto cursor-pointer"
>
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Products</p>
            <AiOutlineFileProtect className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>100</p>
        </div>
      }

      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto cursor-pointer"
>
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Sales</p>
            <FaArrowTrendUp className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>100</p>
        </div>
      }

    </div>

  )
}

export default CardRow