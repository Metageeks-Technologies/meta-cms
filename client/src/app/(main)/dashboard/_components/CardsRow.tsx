'use client'
import React from 'react'
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';
import { useRouter } from 'next/navigation';

const CardsRow = ({ data }: any) => {

  const { user } = useUserContext();
  const router = useRouter();

  return (
    <div className="mx-auto p-4 flex flex-wrap "
    >

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto  cursor-pointer" onClick={() => router.push('/allPost')}>
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'
        >
          <p>Total Published Posts</p>
          <FaRegNewspaper className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{data?.publishedPostsCount}</p>
      </div>


      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto  cursor-pointer" onClick={() => router.push('/allPost')}>
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'

        >
          <p>Total Posts</p>
          <FaRegNewspaper className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{data?.totalPostCount}</p>
      </div>


      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto cursor-pointer"
          onClick={() => (user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN) && router.push('/contributor')}
        >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Contributor</p>
            <FaPenNib className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{data?.usersCount?.contributor}</p>
        </div>
      }

      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) &&
        <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto cursor-pointer"
          onClick={() => (user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN) && router.push('/moderator')}
        >
          <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
            <p>Total Moderator</p>
            <MdSecurity className='text-2xl' />
          </div>
          <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{data?.usersCount?.moderator}</p>
        </div>
      }

    </div>

  )
}

export default CardsRow