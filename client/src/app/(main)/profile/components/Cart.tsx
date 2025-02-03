import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall';
import { getURL } from '@/utils/AWS_Config';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Cart = () => {

    const { setLoading } = useUserContext();
    const [cart, setCart] = useState<any>({});
    const [discount, setDiscount] = useState(0);


    const getMyCart = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/cart`)

            // console.log(resp, "Response in cart component")

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
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/cart/remove`, payload)

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

    useEffect(() => {
        getMyCart();
    }, []);


    return (
        <div className='flex flex-col gap-4'>
            {
                cart?.items?.length > 0 ?
                    cart?.items?.map((item: any, index: number) => (
                        <div className='flex flex-row gap-5 bg-gray-900 p-2 sm:p-4 rounded-lg'>
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
                                                : <span  className="text-lg font-bold text-white"> ₹{item.product.variants.find((variant: any) => variant.variantId === item.variantId).price}</span>
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
                        <button className='w-full max-w-52 bg-white border-2 border-white text-black rounded-lg font-bold p-1 text-lg my-3'>Checkout</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default Cart