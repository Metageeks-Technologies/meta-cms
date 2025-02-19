import React from 'react';
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button";
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { AddressType, EditAddressProps, PostOfficeData } from '@/types';

const EditAddress: React.FC<EditAddressProps> = ({ editAddress, setEditAddress, getUserAddresses, setIsOpen }) => {
    const { setLoading, websiteKey } = useUserContext();
    const isNewAddress = !editAddress?._id;

    const fetchAddressDetails = async (pincode: string): Promise<void> => {
        if (pincode?.length === 6) {
            setLoading(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data: PostOfficeData[] = await response.json();
                
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setEditAddress(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                } else {
                    toast.error("Invalid pincode");
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
                toast.error("Error fetching address details");
            } finally {
                setLoading(false);
            }
        }
    };

    const validatePostalCode = (postalCode: number | string | undefined): boolean => {
        if (!postalCode) return false;
        
        // Convert to string for length check
        const postalCodeStr = postalCode.toString();
        
        // Check if it's exactly 6 digits
        return /^\d{6}$/.test(postalCodeStr);
    };

    const validateAddressData = (addressData: Partial<AddressType>): boolean => {
        const requiredFields: (keyof AddressType)[] = [
            'name', 'phone', 'email', 'house', 
            'street', 'postalCode', 'city', 'state'
        ];

        for (const field of requiredFields) {
            if (!addressData[field]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }

        // Phone number validation
        if (typeof addressData.phone === 'string' && addressData.phone.length !== 10) {
            toast.error("Phone number must be 10 digits");
            return false;
        }

        // Postal code validation
        if (!validatePostalCode(addressData.postalCode)) {
            toast.error("Postal code must be 6 digits");
            return false;
        }

        // Email validation
        if (addressData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email)) {
            toast.error("Please enter a valid email");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        // Validate the entire address object
        if (!validateAddressData(editAddress)) {
            return;
        }

        setLoading(true);
        try {
            // Prepare the payload, ensuring all required fields are present
            const payload: Partial<AddressType> = {
                name: editAddress.name!.trim(),
                phone: editAddress.phone!.trim(),
                email: editAddress.email!.trim(),
                house: editAddress.house!.trim(),
                street: editAddress.street!.trim(),
                postalCode: typeof editAddress.postalCode === 'string' 
                    ? parseInt(editAddress.postalCode) 
                    : editAddress.postalCode!,
                city: editAddress.city!.trim(),
                state: editAddress.state!.trim(),
                ...(editAddress.landmark && { landmark: editAddress.landmark.trim() }),
                ...(editAddress.instruction && { instruction: editAddress.instruction.trim() }),
                ...(editAddress._id && { _id: editAddress._id })
            };
            
            const method = isNewAddress ? 'post' : 'put';
            const endpoint = isNewAddress 
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/address`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/address/${editAddress._id}`;

            const resp = await axiosCall(method, endpoint, payload, { websiteKey });
            
            if (resp.status === 200 || resp.status === 201) {
                toast.success(isNewAddress ? "Address added successfully" : "Address updated successfully");
                getUserAddresses();
                setIsOpen(false);
            } else {
                console.error('Address save failed:', resp);
                toast.error(resp?.data?.message || `Failed to ${isNewAddress ? 'add' : 'update'} address`);
            }
        } catch (error) {
            console.error(`Error ${isNewAddress ? 'adding' : 'updating'} address:`, error);
            
            if (error instanceof Error) {
                const detailedError = error as { 
                    response?: { 
                        data?: any, 
                        status?: number 
                    },
                    message?: string
                };

                console.error('Error Details:', {
                    message: detailedError.message,
                    responseData: detailedError.response?.data,
                    status: detailedError.response?.status,
                });

                toast.error(
                    detailedError.response?.data?.message || 
                    detailedError.message || 
                    `Failed to ${isNewAddress ? 'add' : 'update'} address`
                );
            } else {
                toast.error(`Failed to ${isNewAddress ? 'add' : 'update'} address`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AddressType): void => {
        const { value } = e.target;
        let updatedValue: string | number = value;
        let isValid = true;

        switch (field) {
            case 'name':
                if (!/^[A-Za-z\s]*$/.test(value)) {
                    isValid = false;
                    toast.error("Name should contain only alphabets");
                }
                break;
                
            case 'phone':
                if (!/^\d*$/.test(value) || value.length > 10) {
                    isValid = false;
                    toast.error("Phone number should be 10 digits");
                }
                break;

            case 'postalCode':
                // Allow only numbers
                if (!/^\d*$/.test(value)) {
                    isValid = false;
                    toast.error("Postal code should contain only numbers");
                    return;
                }
                
                // Enforce max length of 6
                if (value.length > 6) {
                    isValid = false;
                    return;
                }

                // Convert to number if valid
                if (isValid) {
                    updatedValue = value ? parseInt(value) : '';
                    if (value.length === 6) {
                        fetchAddressDetails(value);
                    }
                }
                break;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    toast.error("Please enter a valid email");
                }
                break;
        }

        if (isValid) {
            setEditAddress(prev => ({ 
                ...prev, 
                [field]: updatedValue 
            } as Partial<AddressType>));
        }
    };

    return (
        <DialogContent className="sm:max-w-[600px] bg-gray-700 border-gray-800 text-white">
            <DialogHeader>
                <DialogTitle className="text-2xl">
                    {isNewAddress ? "Add New Address" : "Edit Address"}
                </DialogTitle>
            </DialogHeader>
            <form className="py-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                value={editAddress?.name || ''}
                                placeholder="Enter Name"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'name')}
                                required
                                maxLength={20}
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Mobile <span className="text-red-500">*</span></Label>
                            <Input
                                id="phone"
                                value={editAddress?.phone || ''}
                                placeholder="Phone"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'phone')}
                                required
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                value={editAddress?.email || ''}
                                placeholder="Enter email"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'email')}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="house">Flat, House no., Building <span className="text-red-500">*</span></Label>
                            <Input
                                id="house"
                                value={editAddress?.house || ''}
                                placeholder="Enter address"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'house')}
                                required
                                maxLength={25}
                            />
                        </div>

                        <div>
                            <Label htmlFor="street">Area, Street, Sector, Village <span className="text-red-500">*</span></Label>
                            <Input
                                id="street"
                                value={editAddress?.street || ''}
                                placeholder="Enter address"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'street')}
                                required
                                maxLength={25}
                            />
                        </div>

                        <div>
                            <Label htmlFor="landmark">Landmark</Label>
                            <Input
                                id="landmark"
                                value={editAddress?.landmark || ''}
                                placeholder="Enter landmark"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'landmark')}
                                maxLength={25}
                            />
                        </div>

                        <div>
                            <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                            <Input
                                id="postalCode"
                                value={editAddress?.postalCode || ''}
                                placeholder="Enter postal code"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'postalCode')}
                                required
                                maxLength={6}
                            />
                        </div>

                        <div>
                            <Label htmlFor="city">City (Auto)</Label>
                            <Input
                                id="city"
                                value={editAddress?.city || ''}
                                placeholder="Enter postal code to auto-fill"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'city')}
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <Label htmlFor="state">State (Auto)</Label>
                            <Input
                                id="state"
                                value={editAddress?.state || ''}
                                placeholder="Enter postal code to auto-fill"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'state')}
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <Label htmlFor="instruction">Delivery Instructions (Optional)</Label>
                            <Input
                                id="instruction"
                                value={editAddress?.instruction || ''}
                                placeholder="Special instructions for delivery"
                                className="mt-1"
                                onChange={(e) => handleInputChange(e, 'instruction')}
                                maxLength={200}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button 
                        type="submit" 
                        className="bg-green-500 text-white font-bold text-base hover:bg-green-600"
                    >
                        {isNewAddress ? "Add Address" : "Update Address"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default EditAddress;
