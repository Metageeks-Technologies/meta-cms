import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall'
import toast from 'react-hot-toast'


const EditAddress = ({ editAddress, setEditAddress, getUserAddresses, setIsOpen }: any) => {

    const { setLoading } = useUserContext();

    const handleUpdateAddress = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...editAddress
            }
            const resp = await axiosCall('put', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${editAddress._id}`, payload);
            if (resp.status === 200 || resp.status === 201) {
                getUserAddresses();
                setIsOpen(false);
            }else{
                toast.error(resp?.data?.message, {duration: 2000})
            }
        } catch (error) {
            console.log('Error in update address', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePostalCodeChnage = (e: any) => {
        const { value } = e.target;

        if (Number(value) && value.length <= 6) {
            setEditAddress({ ...editAddress, postalCode: Number(e.target.value) }) 
        }
    }


    return (
        <DialogContent className="sm:max-w-[600px] bg-black border-gray-800 text-white">
            <DialogHeader>
                <DialogTitle className='text-2xl'>Edit Address</DialogTitle>
            </DialogHeader>
            <form className="py-4" onSubmit={handleUpdateAddress}>
                <div className='flex flex-row gap-2'>
                    <div className="mb-4 w-full">
                        <Label htmlFor="name" className="text-right">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            value={editAddress?.name}
                            placeholder='Enter Name'
                            className="w-full"
                            onChange={(e) => setEditAddress({ ...editAddress, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <Label htmlFor="phone" className="text-right">
                            Mobile
                        </Label>
                        <Input
                            id="phone"
                            type='number'
                            value={editAddress?.phone}
                            placeholder='Phone'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-2'>

                    <div className="mb-4 w-full">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type='email'
                            value={editAddress?.email}
                            placeholder='Enter email'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <Label htmlFor="house" className="text-right">
                            Flat, House no.,Building
                        </Label>
                        <Input
                            id="house"
                            value={editAddress?.house}
                            placeholder='Enter address'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, house: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-2'>

                    <div className="mb-4 w-full">
                        <Label htmlFor="street" className="text-right">
                            Area, Street, Sector, Village
                        </Label>
                        <Input
                            id="street"
                            value={editAddress?.street}
                            placeholder='Enter address'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <Label htmlFor="landmark" className="text-right">
                            Landmark
                        </Label>
                        <Input
                            id="landmark"
                            value={editAddress?.landmark}
                            placeholder='Enter address'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, landmark: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-2'>

                    <div className="mb-4 w-full">
                        <Label htmlFor="postalCode" className="text-right">
                            Postal Code
                        </Label>
                        <Input
                            id="postalCode"
                            value={editAddress?.postalCode}
                            placeholder='Enter address'
                            className=""
                            onChange={(e) => handlePostalCodeChnage(e)}
                        required
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <Label htmlFor="city" className="text-right">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={editAddress?.city}
                            placeholder='Enter city'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                            required
                        />
                    </div>

                </div>

                <div className='flex flex-row gap-2'>

                    <div className="mb-4 w-full">
                        <Label htmlFor="state" className="text-right">
                            State
                        </Label>
                        <Input
                            id="state"
                            value={editAddress?.state}
                            placeholder='Enter state'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <Label htmlFor="instruction" className="text-right">
                            Instruction (Optional)
                        </Label>
                        <Input
                            id="city"
                            value={editAddress?.instruction}
                            placeholder='Enter instruction'
                            className=""
                            onChange={(e) => setEditAddress({ ...editAddress, instruction: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    {/* <Button type="button" onClick={handleCancel}>Cancel</Button> */}
                    <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Update</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default EditAddress