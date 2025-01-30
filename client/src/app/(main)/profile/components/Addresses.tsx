import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { TriangleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import EditAddress from './EditAddress';

const Addresses = ({ addresses, getUserAddresses }: any) => {

    const { loading, setLoading } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);
    const [editAddress, setEditAddress] = useState<any>({})


    const setDefault = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`);
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }

        } catch (error) {
            console.log("Error in setr address as default", error)
        } finally {
            setLoading(false);
        }
    }

    const deleteAddress = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`);
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }
        } catch (error) {
            console.log('Error in deleting address', error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='flex flex-row flex-wrap gap-5 justify-center md:justify-start'>
            {
                addresses.length <= 0 ?
                    <p className='w-full text-center'>No address found</p>
                    : addresses.map((address: any, index: number) => (
                        <div key={index} className='w-full max-w-[400px] bg-gray-900 rounded-lg'>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <AlertDialog>
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
                                            <DialogTrigger onClick={() => setEditAddress(address)}>
                                                <div className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-white hover:text-black duration-300'>Edit</div>
                                            </DialogTrigger>
                                            <AlertDialogTrigger>
                                                <span>
                                                    <div className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-red-500 duration-300'>Delete</div>
                                                </span>
                                            </AlertDialogTrigger>
                                            {
                                                !address.isDefault &&
                                                <div onClick={() => setDefault(address._id)} className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-white hover:text-black duration-300 cursor-pointer'>Set as Default</div>
                                            }
                                        </div>
                                    </div>

                                    <AlertDialogContent className='bg-black border-gray-800'>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription className='h-24' >
                                                <TriangleAlert className='w-24 h-24 mx-auto text-red-500' />
                                            </AlertDialogDescription>
                                            <AlertDialogDescription className='w-full text-center mb-5 text-lg text-white'>
                                                Delete Address
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteAddress(address._id)} className='bg-red-500 hover:bg-red-600'>Delete</AlertDialogAction>
                                        </AlertDialogFooter>

                                    </AlertDialogContent>

                                    <EditAddress editAddress={editAddress} setEditAddress={setEditAddress} getUserAddresses={getUserAddresses} setIsOpen={setIsOpen} />

                                </AlertDialog>
                            </Dialog>
                        </div>
                    ))
            }
        </div >
    )
}

export default Addresses