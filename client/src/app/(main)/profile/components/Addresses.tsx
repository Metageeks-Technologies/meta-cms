import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react'

const Addresses = ({addresses}: any) => {

    return (
        <div className='flex flex-row flex-wrap gap-5 justify-center md:justify-start'>
            {
                addresses.length <= 0 ?
                    <p className='text-center'>No address found</p>
                    : addresses.map((address: any, index: number) => (
                        <div key={index} className='w-full max-w-[400px] bg-gray-900 rounded-lg'>
                            {
                                address.isDefault &&
                                <div className='px-4 pt-2 text-xs'>Default: MetaCMS</div>
                            }
                            <div className='px-4 py-2 text-sm sm:text-base'>
                                <p className='font-bold text-lg'>{address?.name}</p>
                                <p>{address?.house}</p>
                                <p>{address?.landmark}, {address?.street}</p>
                                <p>{address?.city}, {address?.state}, {address?.postalCode}</p>
                                <p>Phone: {address?.phone}</p>
                                <p>Email: {address?.email}</p>
                                {
                                    address?.instruction &&
                                    <p>Instruction: {address?.instruction}</p>
                                }

                                <div className='mt-3 flex flex-row gap-2'>
                                    <button className='px-4 py-1 border-gray-400 border-2 rounded-full'>Edit</button>
                                    <button className='px-4 py-1 border-gray-400 border-2 rounded-full'>Delete</button>
                                    {
                                        !address.isDefault &&
                                        <button className='px-4 py-1 border-gray-400 border-2 rounded-full'>Set as Default</button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
            }
        </div>
    )
}

export default Addresses