import React, { useEffect, useRef, useState } from 'react'
import { PaymentStatusEnum, PaymentTypeEnum } from '@/constant/user'
import { getURL } from '@/utils/AWS_Config'
import { Package, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useUserContext } from '@/context/userContext'
import axiosCall from '@/utils/ApiCall'
import toast from 'react-hot-toast'

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'UNPAID':
            return {
                color: 'bg-red-500 text-white border-red-700',
                icon: <AlertCircle className='w-5 h-5 text-white' />
            };
        case 'PAID':
            return {
                color: 'bg-green-500 text-white border-green-700',
                icon: <CheckCircle className='w-5 h-5 text-white' />
            };
        default:
            return {
                color: 'bg-yellow-600 text-white border-yellow-700',
                icon: <AlertCircle className='w-5 h-5 text-white' />
            };
    }
}

const OrderCard = ({ order }: { order: any }) => {
    const [showPriceDetails, setShowPriceDetails] = useState(false);
    const paymentStatus = PaymentStatusEnum[order?.paymentStatus as keyof typeof PaymentStatusEnum] || 'UNKNOWN';
    const statusConfig = getStatusConfig(paymentStatus);

    // Safely handle price calculations
    const getItemPrice = (item: any) => {
        // Get price from variant
        const variant = item?.product?.variants?.find((v: any) => v.variantId === item?.variantId);
        const price = variant?.price || item?.product?.price || item?.price || 0;
        const quantity = item?.quantity || 1;
        return {
            price,
            quantity,
            subtotal: price * quantity
        };
    };

    // Calculate total from items
    const calculateOrderTotal = () => {
        if (!order?.items?.length) return 0;
        return order.items.reduce((total: number, item: any) => {
            const { subtotal } = getItemPrice(item);
            return total + subtotal;
        }, 0);
    };

    const orderTotal = calculateOrderTotal();

    return (
        <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden border border-gray-800">
            {/* Order Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-gray-200">
                        Order ID: {order?._id || 'N/A'}
                    </span>
                </div>
                <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} flex items-center gap-2 border`}
                >
                    {statusConfig.icon}
                    <span>{paymentStatus}</span>
                </div>
            </div>

            {/* Order Items */}
            <div
                className={`p-4 ${order?.items?.length > 3
                    ? 'overflow-y-auto max-h-96 styledScrollable'
                    : ''
                    }`}
            >
                {order?.items?.map((item: any, index: number) => {
                    const { price, quantity, subtotal } = getItemPrice(item);
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700 last:border-b-0"
                        >
                            <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-700">
                                {item?.product?.variants
                                    ?.filter(
                                        (variant: any) =>
                                            variant?.variantId ===
                                            item?.variantId,
                                    )
                                    ?.map((variant: any, varIndex: number) => (
                                        <img
                                            key={varIndex}
                                            src={getURL(
                                                variant?.imageKeys?.[0] || '',
                                            )}
                                            alt={
                                                item?.product?.title ||
                                                'Product Image'
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ))}
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-200">
                                    {item?.product?.title || 'Untitled Product'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {item?.product?.subDescription || ''}
                                </p>
                                {showPriceDetails && (
                                    <div className="mt-2 text-gray-300">
                                        <p>Price: ₹{price.toFixed(2)}</p>
                                        <p>Quantity: {quantity}</p>
                                        <p className="font-medium">
                                            Subtotal: ₹{subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Footer */}
            <div className="bg-gray-800 p-4 flex justify-between items-center border-t border-gray-700">
                <button
                    onClick={() => setShowPriceDetails((prev) => !prev)}
                    className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
                >
                    <CreditCard
                        className={`w-5 h-5 cursor-pointer transition-colors duration-200 
        ${showPriceDetails ? 'text-red-400 hover:text-red-500' : 'text-blue-400 hover:text-blue-500'}`}
                    />

                    <span
                        className={`font-medium cursor-pointer transition-colors duration-200 
        ${showPriceDetails ? 'text-red-400 hover:text-red-500' : 'text-blue-400 hover:text-blue-500'}`}
                    >
                        {showPriceDetails ? 'Hide Details' : 'Show Details'}
                    </span>
                </button>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-100">
                        Total: ₹{orderTotal.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}

const Orders = () => {
    const [orders, setOrders] = useState<any>([]);
    const { setLoading, websiteKey } = useUserContext();
    const [pageNo, setPageNo] = useState(1);

    const divRef = useRef<HTMLDivElement>(null)

    const getUserOrders = async () => {
        setLoading(true);
        try {
            const param = new URLSearchParams()
            param.append('page', pageNo.toString())
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/order/my?${param.toString()}`, undefined, { websiteKey })

            if (resp.status === 200 || resp.status === 201) {
                setOrders(resp.data)
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
        if (websiteKey) {
            getUserOrders();
        }
    }, [websiteKey, pageNo]);

    useEffect(() => {
        if (divRef.current) {
            divRef?.current?.scrollTo(0, 0)
        }
    }, [pageNo]);


    if (!orders || orders.length === 0) {
        return (
            <div className='w-full flex flex-col items-center justify-center p-10 bg-gray-900 rounded-lg'>
                <XCircle className='w-16 h-16 text-gray-600 mb-4' />
                <p className='text-xl text-gray-400 font-semibold'>No orders found</p>
                <p className='text-gray-500 mt-2'>You haven't placed any orders yet</p>
            </div>
        )
    }

    const decreasePageNumber = () => {
        if (pageNo > 1) {
            setPageNo((prev) => prev - 1);
        }
    }

    const increasePageNumber = () => {
        if (orders.length >= 10) {
            setPageNo((prev) => prev + 1);
        }
    }

    return (
        <div className='w-full max-w-4xl mx-auto space-y-4 max-h-[600px] overflow-y-auto styledScrollable p-1' ref={divRef}>
            {orders?.map((order: any, index: number) => (
                <OrderCard key={index} order={order} />
            ))}

            <div className='flex flex-row items-center justify-center py-10'>
                <div className='flex flex-row gap-5 items-center'>
                    <button
                        onClick={decreasePageNumber}
                        disabled={pageNo <= 1}
                        className={`px-2 py-2 rounded-lg bg-white text-black text-sm ${pageNo <= 1 ? "bg-slate-400" : ""}`}
                    >
                        Previous
                    </button>
                    <span className='border-[1px] px-[16px] py-[7px] rounded-lg'>{pageNo}</span>
                    <button
                        onClick={increasePageNumber}
                        disabled={orders.length < 10}
                        className={`px-2 py-2 border-[1px] rounded-lg bg-white text-black text-sm ${orders.length < 10 ? "bg-slate-400" : ""}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Orders