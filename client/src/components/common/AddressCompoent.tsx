import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
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
import EditAddress from '@/app/(main)/profile/components/EditAddress';




const AddressCompoent = ({ user }: any) => {

    const { setLoading } = useUserContext();
    const [addresses, setAddresses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editAddress, setEditAddress] = useState<any>();
    const [selectAction, setSelectAction] = useState(0);


    const fetchAddress = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/address/all/${user._id}`)


            if (resp.status === 200 || resp.status === 201) {
                setAddresses(resp?.data)
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in fetch user address : ", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteAddress = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`);
            if (resp.status === 200 || resp.status === 201) {
                fetchAddress();
            }
        } catch (error) {
            console.log('Error in deleting address', error);
        } finally {
            setLoading(false);
        }
    }

    const recoverAddress = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/address/recover/${id}`);
            if (resp.status === 200 || resp.status === 201) {
                fetchAddress();
            }
        } catch (error) {
            console.log('Error in recover address', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAddress();
    }, [user])

    return (
        <div className='w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto styledScrollable'>
            {
                addresses.length <= 0 ?
                    <p className='w-full text-center'>No address found</p>
                    : addresses.map((address: any, index: number) => (
                        <div key={index} className='w-full bg-gray-900 rounded-lg'>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <AlertDialog>
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

                                        <div className='mt-3 flex flex-row gap-2 items-end'>
                                            {
                                                address?.isDeleted &&
                                                <p className='mr-2 text-red-500 font-bold'>Deleted</p>
                                            }
                                            <DialogTrigger onClick={() => setEditAddress(address)}>
                                                <div className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-white hover:text-black duration-300'>Edit</div>
                                            </DialogTrigger>
                                            {
                                                address?.isDeleted ?
                                                    <AlertDialogTrigger onClick={() => setSelectAction(1)}>
                                                        <span>
                                                            <div className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-green-500 duration-300'>Recover</div>
                                                        </span>
                                                    </AlertDialogTrigger>

                                                    : <AlertDialogTrigger onClick={() => setSelectAction(2)}>
                                                        <span>
                                                            <div className='px-4 py-1 border-gray-400 border-2 rounded-full hover:bg-red-500 duration-300'>Delete</div>
                                                        </span>
                                                    </AlertDialogTrigger>
                                            }
                                        </div>
                                    </div>

                                    <AlertDialogContent className='bg-black border-gray-800'>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription className='h-24' >
                                                <TriangleAlert className={`w-24 h-24 mx-auto ${selectAction === 1 ? "text-green-500" : selectAction === 2 ? "text-red-500" : ""}`} />
                                            </AlertDialogDescription>
                                            <AlertDialogDescription className='w-full text-center mb-5 text-lg text-white'>
                                                {
                                                    selectAction === 1 ?
                                                        "Revocer Address"
                                                        : selectAction === 2 ?
                                                            "Delete Address"
                                                            : null
                                                }
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    selectAction === 1 ?
                                                        recoverAddress(address._id)
                                                        : selectAction === 2 ?
                                                            deleteAddress(address._id)
                                                            : null
                                                }}
                                                className={`${selectAction === 1 ? "bg-green-500 hover:bg-green-600" : selectAction === 2 ? "bg-red-500 hover:bg-red-600" : ""}`}
                                            >{selectAction === 1 ? "Recover" : selectAction === 2 ? "Delete" : null}</AlertDialogAction>
                                        </AlertDialogFooter>

                                    </AlertDialogContent>

                                    <EditAddress editAddress={editAddress} setEditAddress={setEditAddress} getUserAddresses={fetchAddress} setIsOpen={setIsOpen} />

                                </AlertDialog>
                            </Dialog>
                        </div>
                    ))
            }
        </div >
    )
}

export default AddressCompoent