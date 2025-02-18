import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall';
import { getURL } from '@/utils/AWS_Config';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MdOutlinePayments } from "react-icons/md";
import { MdOutlineOnlinePrediction } from "react-icons/md";
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
import EditAddress from './EditAddress';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const Cart = () => {

    const { setLoading,websiteKey } = useUserContext();
    const [cart, setCart] = useState<any>({});
    const [discount, setDiscount] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [addresses, setAddresses] = useState<any>([]);
    // const [editAddress, setEditAddress] = useState<any>({});
    const [isOpen, setIsOpen] = useState(false);
    const [addNew, setAddNew] = useState(false);
    const [newAddress, setNewAddress] = useState<any>({});

    const getMyCart = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,undefined,{websiteKey})


            if (resp.status === 200 || resp.status === 201) {
                setCart(resp?.data)
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in fetching cart : ", error);
        } finally {
            setLoading(false);
        }
    }

    const removeItemFromCart = async (productId: string, variantId: string) => {
        setLoading(true);
        try {

            const payload = {
                productId,
                variantId
            }
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/cart/remove`, payload,{websiteKey})

            if (resp.status === 200 || resp.status === 201) {
                getMyCart();

            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in removing item form cart : ", error);
        } finally {
            setLoading(false);
        }
    }

    const getTotal = (total: number, item: any) => {
        const variant = item.product.variants.find((variant: any) => variant.variantId === item.variantId);

        const totalAmount = variant.discountedPrice ? variant.discountedPrice * item.quantity : variant.price * item.quantity;

        return totalAmount + total;
    }

    const getUserAddress = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/address`,undefined,{websiteKey})


            if (resp.status === 200 || resp.status === 201) {
                setAddresses(resp?.data)
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in fetching user address in cart");
        } finally {
            setLoading(false);
        }
    }

    const handleAddNewAddress = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...newAddress
            }
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/address`, payload,{websiteKey});
            if (resp.status === 200 || resp.status === 201) {
                getUserAddress();
                setAddNew(false);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
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
            setNewAddress({ ...newAddress, postalCode: Number(e.target.value) })
        }
    }



    useEffect(() => {
        getMyCart();
        getUserAddress();
    }, []);


    const createCODOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                cartId: cart._id,
                addressId: selectedAddress
            }
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/order`, payload);
            if (resp.status === 200 || resp.status === 201) {
                getMyCart();
                setIsOpen(false);
                toast.success("Order Placed", { duration: 2000 })
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in crate COD order : ", error);
        } finally {
            setLoading(false);
        }
    }


    const createPaymentOrder = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/order/initiate-payment`);

            if (resp.status === 200 || resp.status === 201) {
                return resp?.data;
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in crate payment order : ", error);
        } finally {
            setLoading(false);
        }
    }

    const loadScript = (src: any) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };



    const handlePayment = async () => {
        setLoading(true);

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet");
            return;
        }

        const order = await createPaymentOrder();


        if (!order) {
            alert("Failed to create order");
            setLoading(false);
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: "CMS Store",
            description: "Payment for order",
            order_id: order.orderId,
            handler: async function (response: any) {
                toast.success("Payment Successful", { duration: 2000 });

                const payload = {
                    cartId: cart._id,
                    addressId: selectedAddress,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                }
                const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/order/verify-create-order`, payload,{websiteKey});

                if (resp.status === 200 || resp.status === 201) {
                    toast.success(resp?.data?.message, { duration: 2000 });
                } else {
                    toast.error(resp?.data?.message, { duration: 2000 })
                }

            },
            prefill: {
                name: order?.name,
                email: order?.email,
            },
            theme: { color: "#F37254" },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        setLoading(false);
    }


    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            setSelectedAddress("");
            setAddNew(false);
        }}>

            <div className='flex flex-col gap-4'>
                {
                    cart?.items?.length > 0 ?
                        cart?.items?.map((item: any, index: number) => (
                            <div key={index} className='flex flex-row gap-5 bg-gray-900 p-2 sm:p-4 rounded-lg'>
                                <div className='w-32'>
                                    <img src={getURL(item.product.variants.find((variant: any) => variant.variantId === item.variantId)?.imageKeys[0])} className='w-full object-contain' />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <p className='font-bold'>{item?.product?.title}</p>
                                    <p className='text-sm text-gray-400'>{item?.product?.subDescription}</p>
                                    <div> <span>Qty: {item.quantity}</span> |
                                        <span> Price:
                                            {
                                                item.product.variants.find((variant: any) => variant.variantId === item.variantId).discountedPrice && item.product.variants.find((variant: any) => variant.variantId === item.variantId).discountedPrice < item.product.variants.find((variant: any) => variant.variantId === item.variantId).price ?
                                                    <span>
                                                        <span className="text-lg font-bold text-white"> ₹{item.product.variants.find((variant: any) => variant.variantId === item.variantId).discountedPrice}</span>
                                                        <span className="text-sm text-gray-400 line-through ml-2">₹{item.product.variants.find((variant: any) => variant.variantId === item.variantId).price}</span>
                                                    </span>
                                                    : <span className="text-lg font-bold text-white"> ₹{item.product.variants.find((variant: any) => variant.variantId === item.variantId).price}</span>
                                            }

                                        </span>
                                    </div>

                                    <button onClick={() => removeItemFromCart(item.product._id, item.variantId)} className='max-w-min border-2 px-2 py-1 rounded-full text-sm hover:bg-white hover:text-black duration-300 mt-3'>Remove</button>
                                </div>
                            </div>

                        ))
                        : <p className='my-10 text-center'>No item in your cart.</p>
                }

                {
                    cart?.items?.length > 0 &&
                    <div className='bg-gray-900 my-5 rounded-lg p-4 flex flex-col gap-2'>
                        <p className='text-2xl font-bold mt-2 mb-2'>Order Details</p>
                        <div className='flex flex-row justify-between items-center'>
                            <p>Cart total :</p>
                            <p className='font-bold'>₹{cart?.items?.reduce(getTotal, 0)}</p>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <p>Discount :</p>
                            <p className='font-bold'>₹{discount}</p>
                        </div>

                        <hr />

                        <div className='flex flex-row justify-between items-center'>
                            <p>Amount Payable :</p>
                            <p className='font-bold'>₹{cart?.items?.reduce(getTotal, 0) - discount}</p>
                        </div>

                        <div className='flex flex-row justify-end'>
                            <DialogTrigger onClick={() => setIsOpen(true)}>
                                <div className='maz-w-min bg-white border-2 border-white text-black rounded-lg font-bold p-1 px-5 text-lg my-3'>Checkout</div>
                            </DialogTrigger>
                        </div>
                    </div>
                }


                <DialogContent className={`min-w-[500px] max-h-[600px] overflow-y-auto  bg-gray-950 text-white border-none p-0 styledScrollable`}>
                    <DialogTitle></DialogTitle>


                    {
                        !addNew ?
                            !selectedAddress ?
                                <div className='flex flex-col gap-2 mt-10 mx-5'>
                                    <h3 className='text-2xl font-bold'>Select Address</h3>
                                    {
                                        addresses?.length <= 0 ?
                                            <p className='w-full text-center'>No address found</p>
                                            : addresses?.map((address: any, index: number) => (
                                                <div key={index} className='w-full bg-gray-900 rounded-lg'>
                                                    <div onClick={() => setSelectedAddress(address?._id)} className='px-4 py-2 text-sm sm:text-base cursor-pointer'>
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
                                                    </div>

                                                </div>
                                            ))
                                    }

                                    <button type='button' onClick={() => setAddNew(true)} className='w-full bg-white rounded-lg font-bold text-lg p-2 text-black hover:bg-gray-900 hover:text-white duration-300 border-2 border-white my-5'>Add new</button>
                                </div>
                                : <div>
                                    <div className='mt-20 flex flex-row justify-center items-center text-9xl'>
                                        <MdOutlinePayments />
                                    </div>

                                    <div className='mb-10 flex flex-col gap-3 p-4'>
                                        <button onClick={handlePayment} className='w-full bg-gray-900 rounded-lg font-bold text-lg p-2 hover:bg-white hover:text-black duration-300 flex flex-row justify-center items-center gap-2'> <MdOutlineOnlinePrediction /> Pay Online</button>
                                        <button onClick={createCODOrder} className='w-full bg-gray-900 rounded-lg font-bold text-lg p-2 hover:bg-white hover:text-black duration-300'>Cash on delivery</button>
                                    </div>
                                </div>
                            :
                            <div className='p-4'>
                                <div className='flex flex-row gap-2 items-center text-2xl'>
                                    <FaArrowLeftLong onClick={() => { setAddNew(false); setNewAddress({}) }} className='cursor-pointer' />
                                    <h3 className='text-2xl font-bold'>Select Address</h3>
                                </div>
                                <div>
                                    <form className="py-4" onSubmit={handleAddNewAddress}>
                                        <div className='flex flex-row gap-2'>
                                            <div className="mb-4 w-full">
                                                <Label htmlFor="name" className="text-right">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={newAddress?.name}
                                                    placeholder='Enter Name'
                                                    className="w-full"
                                                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
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
                                                    value={newAddress?.phone}
                                                    placeholder='Phone'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
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
                                                    value={newAddress?.email}
                                                    placeholder='Enter email'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <Label htmlFor="house" className="text-right">
                                                    Flat, House no.,Building
                                                </Label>
                                                <Input
                                                    id="house"
                                                    value={newAddress?.house}
                                                    placeholder='Enter address'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
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
                                                    value={newAddress?.street}
                                                    placeholder='Enter address'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <Label htmlFor="landmark" className="text-right">
                                                    Landmark
                                                </Label>
                                                <Input
                                                    id="landmark"
                                                    value={newAddress?.landmark}
                                                    placeholder='Enter address'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
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
                                                    value={newAddress?.postalCode}
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
                                                    value={newAddress?.city}
                                                    placeholder='Enter city'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
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
                                                    value={newAddress?.state}
                                                    placeholder='Enter state'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4 w-full">
                                                <Label htmlFor="instruction" className="text-right">
                                                    Instruction (Optional)
                                                </Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress?.instruction}
                                                    placeholder='Enter instruction'
                                                    className=""
                                                    onChange={(e) => setNewAddress({ ...newAddress, instruction: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            {/* <Button type="button" onClick={handleCancel}>Cancel</Button> */}
                                            <Button type="submit" className='bg-green-500 text-white font-bold text-base hover:bg-green-600'>Add</Button>
                                        </DialogFooter>
                                    </form>
                                </div>
                            </div>
                    }
                </DialogContent>

            </div>
        </Dialog>
    )
}

export default Cart