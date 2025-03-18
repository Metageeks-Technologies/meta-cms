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
} from '@/components/ui/alert-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
    TriangleAlert,
    MapPin,
    Home,
    Phone,
    Mail,
    Edit2,
    Trash2,
    Star,
    Info,
    Plus,
} from 'lucide-react';
import EditAddress from './EditAddress';
import { AddressType } from '@/types';

const AddressCard = ({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}: {
    address: any;
    onEdit: (address: any) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}) => (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 w-full">
        <div className="relative">
            {address.isDefault && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2 bg-blue-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                    <Star className="w-4 h-4" />
                    <span>Default</span>
                </div>
            )}

            <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4 break-words">
                    {address?.name}
                </h3>

                <div className="space-y-2 sm:space-y-3 text-gray-300">
                    <div className="flex items-start gap-2 sm:gap-3">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="break-words">
                            <p>{address?.house}</p>
                            <p>
                                {address?.landmark}, {address?.street}
                            </p>
                            <p>
                                {address?.city}, {address?.state},{' '}
                                {address?.postalCode}
                            </p>
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

            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                        onClick={() => onEdit(address)}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                    >
                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Edit</span>
                    </button>

                    {!address.isDefault && (
                        <AlertDialog>
                            <AlertDialogTrigger className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors duration-200 text-sm">
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-gray-900 border-gray-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle></AlertDialogTitle>
                                    <div className="flex flex-col items-center gap-4">
                                        <TriangleAlert className="w-16 h-16 text-red-500" />
                                        <h2 className="text-xl font-semibold text-gray-100">
                                            Delete Address
                                        </h2>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this
                                            address? This action cannot be
                                            undone.
                                        </AlertDialogDescription>
                                    </div>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(address._id)}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {!address.isDefault && (
                        <button
                            onClick={() => onSetDefault(address._id)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200 text-sm"
                        >
                            <Star className="w-4 h-4" />
                            <span>Set Default</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Addresses = ({ addresses, getUserAddresses }: any) => {
    const { loading, setLoading, websiteKey } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);
    const [editAddress, setEditAddress] = useState<AddressType>({
        _id: '',
        name: '',
        phone: '',
        email: '',
        house: '',
        street: '',
        landmark: '',
        postalCode: '',
        city: '',
        state: '',
        instruction: '',
    });

    const setDefault = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'patch',
                `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`,
                undefined,
                { websiteKey },
            );
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }
        } catch (error) {
            console.log('Error in set address as default', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'delete',
                `${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`,
                undefined,
                { websiteKey },
            );
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
            }
        } catch (error) {
            console.log('Error in deleting address', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewClick = () => {
        setEditAddress({
            _id: '',
            name: '',
            phone: '',
            email: '',
            house: '',
            street: '',
            landmark: '',
            postalCode: '',
            city: '',
            state: '',
            instruction: '',
        });
        setIsOpen(true);
    };

    const handleEditClick = (address: any) => {
        setEditAddress(address);
        setIsOpen(true);
    };

    if (addresses.length <= 0) {
        return (
            <div className="w-full min-h-[200px] flex items-center justify-center relative">
                <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-300">
                        No addresses found
                    </p>
                    <p className="text-gray-400 mt-2">
                        Add a new address to get started
                    </p>
                    <button
                        onClick={handleAddNewClick}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        Add Address
                    </button>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <EditAddress
                        editAddress={editAddress}
                        setEditAddress={setEditAddress}
                        getUserAddresses={getUserAddresses}
                        setIsOpen={setIsOpen}
                    />
                </Dialog>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-2 sm:p-4">
                {addresses
                    .sort((a: any, b: any) => (b.isDefault ? 1 : -1)) // Sort default address to top
                    .map((address: any) => (
                        <AddressCard
                            key={address._id}
                            address={address}
                            onEdit={handleEditClick}
                            onDelete={deleteAddress}
                            onSetDefault={setDefault}
                        />
                    ))}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleAddNewClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Add Address</span>
                </button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <EditAddress
                    editAddress={editAddress}
                    setEditAddress={setEditAddress}
                    getUserAddresses={getUserAddresses}
                    setIsOpen={setIsOpen}
                />
            </Dialog>
        </div>
    );
};

export default Addresses;