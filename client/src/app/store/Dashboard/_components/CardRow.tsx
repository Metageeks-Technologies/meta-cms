'use client'
import React from 'react'
import { BsCart2 } from "react-icons/bs";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';

const CardRow = ({ totalOrderCount, totalProductCount, totalPublishedProductCount }: any) => {

const router = useRouter();

  return (
    <div className="mx-auto p-4 flex flex-wrap ">

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-2 cursor-pointer" >
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Orders</p>
          <BsCart2 className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalOrderCount}</p>
      </div>


      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-1 cursor-pointer"  onClick={() => router.push('/store/allProduct')}
      >
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Products</p>
          <AiOutlineFileProtect className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalProductCount}</p>
      </div>


      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-1 cursor-pointer"
      >
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Published Products</p>
          <AiOutlineFileProtect className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalPublishedProductCount}</p>
      </div>


    </div>

  )
}

export default CardRow