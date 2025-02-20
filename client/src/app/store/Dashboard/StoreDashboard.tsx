import { useUserContext } from '@/context/userContext'
import React, { useEffect, useState } from 'react'
import CardRow from '@/app/store/Dashboard/_components/CardRow';
import RecentOrders from '@/app/store/Dashboard/_components/RecentOrders';
import LineChart from '@/app/store/Dashboard/_components/lineChart';
import PieChart from '@/app/store/Dashboard/_components/PieChart';
import LatestProducts from '@/app/store/Dashboard/_components/LatestProduct';
import { userRoles } from '@/constant/user';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';

const StoreDashboard = () => {

    const { user, setLoading, websiteKey } = useUserContext();
    const [dashboardData, setDashboardData] = useState<any>({});


    const fetchStoreAdminDashboard = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/store/admin`, undefined, { websiteKey });

            if (resp.status === 200 || resp.status === 201) {
                setDashboardData(resp?.data);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in fetching store admin dashboard data :", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchStoreVendorDashboard = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/store/vendor`, undefined, { websiteKey });

            if (resp.status === 200 || resp.status === 201) {
                setDashboardData(resp?.data);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in fetching store admin dashboard data :", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (websiteKey) {
            if (user.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) {
                fetchStoreAdminDashboard();
            }

            if (user.role === userRoles.CONTRIBUTOR) {
                fetchStoreVendorDashboard();
            }
        }
    }, [user, websiteKey])

    return (
        <div className='mb-6'>


            {user?.role === userRoles.SUPERADMIN || user?.role === userRoles.ADMIN || user.role === userRoles.MODERATOR ? (
                <CardRow
                    totalOrderCount={dashboardData?.totalOrderCount}
                    totalProductCount={dashboardData?.totalProductCount}
                    totalPublishedProductCount={dashboardData?.totalPublishedProductCount}
                />
            ) : (
                <CardRow
                    totalOrderCount={dashboardData?.totalOrderCount}
                    totalProductCount={dashboardData?.totalProductCount}
                    totalPublishedProductCount={dashboardData?.totalPublishedProductCount}
                />
            )}
            <div className="flex w-[97%] mx-auto mt-5">
                <div className="w-[65%] text-white p-6 rounded-lg border-[1px] border-gray-800">
                    <LineChart data={dashboardData?.monthlyOrdersCount} />
                </div>
                <div className="w-[35%] text-white p-6 rounded-lg border-[1px] border-gray-800 ml-4">
                    <PieChart data={dashboardData?.topSellingProduct} />
                </div>

            </div>
            <div className="flex w-[97%] mx-auto mt-5">

                <div className="w-[65%] text-white p-6 rounded-lg border-[1px] border-gray-800 ">
                    <RecentOrders data={dashboardData?.recentOrder} />
                </div>

                <div className="w-[35%] text-white p-6 rounded-lg border-[1px] border-gray-800 ml-4 ">
                    <LatestProducts data={dashboardData?.recentProduct} />
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default StoreDashboard