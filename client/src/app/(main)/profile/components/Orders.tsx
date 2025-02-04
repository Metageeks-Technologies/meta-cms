import { PaymentStatusEnum, PaymentTypeEnum } from '@/constant/user'
import { getURL } from '@/utils/AWS_Config'
import React from 'react'

const Orders = ({ orders }: any) => {
    return (
        <div className='w-full flex flex-col gap-2'>
            {
                orders.length <= 0 ?
                    <p className='text-center'>No order found</p>
                    : orders?.map((order: any, index: number) => (
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
                                                    item.product.variants.filter((variant: any) => variant.variantId === item.variantId).map((variant: any, index: number) => (
                                                        <img key={index} src={getURL(variant.imageKeys[0])} className='w-full h-full object-contain' />
                                                    ))
                                                }
                                            </div>
                                            <div>
                                                <p>{item.product.title}</p>
                                                <p>{item.product.subDescription}</p>
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

export default Orders