import { PaymentStatusEnum, PaymentTypeEnum } from '@/constant/user';
import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall';
import { getURL } from '@/utils/AWS_Config';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const OrderComponent = ({user} : any) => {

    const { setLoading,websiteKey } = useUserContext()

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/order/${user._id}`,undefined,{websiteKey})


            if (resp.status === 200 || resp.status === 201) {
                setOrders(resp?.data)
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in fetching user orders : ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [user])

  return (
     <div className='w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto styledScrollable'>
                {
                    orders.length <= 0 ?
                        <p className='text-center'>No order found</p>
                        : orders.map((order: any, index: number) => (
                            <div key={index} className='bg-gray-900 p-4 rounded-lg flex flex-col gap-2'>
                                <div>
                                    <p>{PaymentStatusEnum[order.paymentStatus as keyof typeof PaymentStatusEnum]}</p>
                                </div>
                                <div>
                                    {
                                        order.items.map((item: any, index: number) => (
                                            <div key={index} className='flex flex-row gap-5 my-1'>
                                                <div className='w-[120px] h-[130px]'>
                                                    {
                                                        item.product.variants.filter((variant: any) => variant.variantId === item.variantId).map((variant: any) => (
                                                            <img src={getURL(variant.imageKeys[0])} className='w-full h-full object-contain' />
                                                        ))
                                                    }
                                                </div>
                                                <div>
                                                    <p>{item.product.title}</p>
                                                    <p>{item.product.subDescription}</p>
                                                    <div>
                                                        <p>Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='flex gap-5'>
                                    <p>Total Amount: {order.totalAmount}</p>
                                    <p>Payment Type: {PaymentTypeEnum[order.paymentType as keyof typeof PaymentTypeEnum]}</p>
                                </div>
                            </div>
                        ))
                }
            </div>
  )
}

export default OrderComponent