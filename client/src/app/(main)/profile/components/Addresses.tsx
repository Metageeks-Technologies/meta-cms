import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import React, { useEffect, useState } from 'react';
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
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TriangleAlert, MapPin, Home, Phone, Mail, Edit2, Trash2, Star, Info } from 'lucide-react';
import EditAddress from './EditAddress';

const Addresses = ({ addresses, getUserAddresses }: any) => {
    const { loading, setLoading,websiteKey,user } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);
    const [editAddress, setEditAddress] = useState<any>({});

    const setDefault = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`,undefined,{websiteKey});
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }
        } catch (error) {
            console.log("Error in set address as default", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`,undefined,{websiteKey});
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }
        } catch (error) {
            console.log('Error in deleting address', error);
        } finally {
            setLoading(false);
        }
    };

 

    if (addresses.length <= 0) {
        return (
            <div className="w-full min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-300">No addresses found</p>
                    <p className="text-gray-400 mt-2">Add a new address to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            {addresses.map((address: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 min-w-[280px]">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialog>
                            <div className="relative">
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-full text-sm">
                                        <Star className="w-4 h-4" />
                                        <span>Default</span>
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-100 mb-4 break-words">{address?.name}</h3>
                                    
                                    <div className="space-y-3 text-gray-300">
                                        <div className="flex items-start gap-3">
                                            <Home className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="break-words">
                                                <p>{address?.house}</p>
                                                <p>{address?.landmark}, {address?.street}</p>
                                                <p>{address?.city}, {address?.state}, {address?.postalCode}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <p>{address?.phone}</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <p>{address?.email}</p>
                                        </div>
                                        
                                        {address?.instruction && (
                                            <div className="flex items-start gap-3">
                                                <Info className="w-5 h-5 text-gray-400 mt-1" />
                                                <p>{address?.instruction}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="flex flex-wrap gap-3">
                                        <DialogTrigger 
                                            onClick={() => setEditAddress(address)}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>Edit</span>
                                        </DialogTrigger>

                                        <AlertDialogTrigger className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors duration-200 text-sm">
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </AlertDialogTrigger>

                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setDefault(address._id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200 text-sm"
                                            >
                                                <Star className="w-4 h-4" />
                                                <span>Set Default</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AlertDialogContent className="bg-gray-900 border-gray-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle></AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div className="flex flex-col items-center gap-4">
                                            <TriangleAlert className="w-16 h-16 text-red-500" />
                                            <h2 className="text-xl font-semibold text-gray-100">Delete Address</h2>
                                            <p className="text-gray-400 text-center">
                                                Are you sure you want to delete this address? This action cannot be undone.
                                            </p>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => deleteAddress(address._id)} 
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>

                            <EditAddress 
                                editAddress={editAddress} 
                                setEditAddress={setEditAddress} 
                                getUserAddresses={getUserAddresses} 
                                setIsOpen={setIsOpen} 
                            />
                        </AlertDialog>
                    </Dialog>
                </div>
            ))}
        </div>
    );
};

export default Addresses;