'use client'
import React, { useEffect, useState } from 'react'
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';

const CardsRow = () => {

  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalSubscriber, setTotalSubscriber] = useState<number>(0);
  const [totalContributors, setTotalContributors] = useState<number>(0);
  const [totalModerators, setTotalModerators] = useState<number>(0);

  const fetchAllPosts = async () => {
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts`)
      // console.log(resp, "response")

      if (resp.status === 200 || resp.status === 201) {
        setTotalPosts(resp?.data?.length );
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllSubscriber = async () => {
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-subscribers`)
      // console.log(resp, "response subscriber")

      if (resp.status === 200 || resp.status === 201) {
        setTotalSubscriber(resp?.data?.users?.length);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllContributor = async () => {
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-contributor`);
      // console.log(resp, "response contributor")

      if (resp.status === 200 || resp.status === 201) {
        setTotalContributors(resp?.data?.users?.length);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllModerator = async () => {
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-moderator`)
      // console.log(resp, "response moderator")

      if (resp.status === 200 || resp.status === 201) {
        setTotalModerators(resp?.data?.users?.length);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    fetchAllPosts();
    fetchAllSubscriber();
    fetchAllContributor()
    fetchAllModerator();
  }, []);


  return (
    <div className="mx-auto p-4 flex flex-wrap">

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Posts</p>
          <FaRegNewspaper className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalPosts}</p>
      </div>


      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Subscribers</p>
          <FaUsers className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalSubscriber}</p>
      </div>

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Contributor</p>
          <FaPenNib className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalContributors}</p>
      </div>

      <div className="w-full sm:w-[49%] md:w-[24%] p-2 md:px-4 lg:px-6 md:py-4 border-[1px] border-gray-800 rounded-lg mx-auto">
        <div className='flex flex-row items-center justify-between mb-2 text-gray-300'>
          <p>Total Modrator</p>
          <MdSecurity className='text-2xl' />
        </div>
        <p className='text-2xl md:text-3xl lg:text-4xl font-black'>{totalModerators}</p>
      </div>

    </div>

  )
}

export default CardsRow