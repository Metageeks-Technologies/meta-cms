'use client'
import React from 'react'
import { BsCart2 } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { AiOutlineFileProtect } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';
import { StoreRole } from '@/constant/store';

const CardRow = ({ storeUserCount, totalOrderCount, totalProductCount }: any) => {


  // if(!storeUserCount || !totalOrderCount || !totalProductCount){
  //   return <div></div>
  // }

  const { user } = useUserContext();

  return (
    <div className="mx-auto p-4 flex flex-nowrap ">

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-2 cursor-pointer" >
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Orders</p>
          <BsCart2 className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalOrderCount}</p>
      </div>

      {
        (user?.storeRole === StoreRole.SUPERADMIN || user.storeRole === StoreRole.STOREMODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-2 cursor-pointer" >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Users</p>
            <FaUsers className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{storeUserCount?.user}</p>
        </div>
      }

      {
        (user?.storeRole === StoreRole.SUPERADMIN || user.storeRole === StoreRole.STOREMODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-2 cursor-pointer" >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Vendors</p>
            <FaUsers className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{storeUserCount?.vendor}</p>
        </div>
      }

      {
        (user?.storeRole === StoreRole.SUPERADMIN || user.storeRole === StoreRole.STOREMODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-2 cursor-pointer" >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Moderator</p>
            <FaUsers className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{storeUserCount?.moderator}</p>
        </div>
      }



      {
        (user?.storeRole === StoreRole.VENDOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-1 cursor-pointer"
        >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Products</p>
            <AiOutlineFileProtect className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalProductCount}</p>
        </div>
      }

    </div>

  )
}

export default CardRow