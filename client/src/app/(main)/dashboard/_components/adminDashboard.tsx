import React, { useEffect, useState } from 'react';
import CardsRow from './CardsRow';
import Chart from './Chart';
import RecentPosts from './RecentPosts';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';
import MyRecentPosts from './MyRecentPosts';
import CardRow from '@/app/store/Dashboard/CardRow';
import RecentOrders from '@/app/store/Dashboard/RecentOrders';
import LineChart from '@/app/store/Dashboard/lineChart';
import PieChart from '@/app/store/Dashboard/PieChart';
import LatestProducts from '@/app/store/Dashboard/LatestProduct';

const AdminDashboard = () => {

  const { user, setLoading } = useUserContext();

  const [personalDashboardData, setPersonalDashboardData] = useState();
  const [globalDashboardData, setGlobalDashboardData] = useState();



  const [isBlogDashboard, setIsBlogDashboard] = useState(true); // State to toggle between dashboards


  const dashboardGlobal = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin/global`);

      if (resp.status === 200 || resp.status === 201) {
        setGlobalDashboardData(resp?.data);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const dashboardPersonal = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin/personal`)
      
      if (resp.status === 200 || resp.status === 201) {
        setPersonalDashboardData(resp?.data);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user.role){
      dashboardPersonal();
      dashboardGlobal();
    }
  }, [user]);



  return (
    <div className="container mx-auto">


<div className="flex justify-start mb-5">
        <button
          onClick={() => setIsBlogDashboard(true)}
          className={`px-4 py-2 rounded transition-colors duration-300 ${isBlogDashboard ? 'bg-zinc-300 text-black' : 'bg-zinc-900 text-white'}`}
        >
          Blog Dashboard
        </button>
        <button
          onClick={() => setIsBlogDashboard(false)}
          className={`px-4 py-2 rounded transition-colors duration-300 ${!isBlogDashboard ? 'bg-zinc-300 text-black' : 'bg-zinc-900 text-white'}`}
        >
          Store Dashboard
        </button>
      </div>


      {isBlogDashboard ? (
        <>
          {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) ?
        <CardsRow data={globalDashboardData} />
        :<CardsRow data={personalDashboardData} />
      }
      {
        (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) &&
        <RecentPosts />
      }
      <MyRecentPosts />

      <div className={`
        ${(user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) ? "w-[97%]" :"w-[50%]"}
        mx-auto flex flex-row items-center gap-5 mt-20`}>
        {
          (user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR) &&
          <Chart heading="Global Monthly Posts" data={globalDashboardData} />
        }
        <Chart heading="My Monthly Posts" data={personalDashboardData} />
      </div>
        </>
         ) : (
          <div className='mb-6'>
            {user?.role === userRoles.SUPERADMIN || user.role === userRoles.MODERATOR ? (
              <CardRow />
            ) : (
              <CardRow />
            )}
            <div className="flex w-[97%] mx-auto mt-5">
              <div className="w-[65%] text-white p-6 rounded-lg border-[1px] border-gray-800">
                <LineChart />
              </div>
              <div className="w-[35%] text-white p-6 rounded-lg border-[1px] border-gray-800 ml-4">
                <PieChart />
              </div>
             
            </div>
            <div className="flex w-[97%] mx-auto mt-5">

            <div className="w-[65%] text-white p-6 rounded-lg border-[1px] border-gray-800 ">
            <RecentOrders />
              </div>
              
              <div className="w-[35%] text-white p-6 rounded-lg border-[1px] border-gray-800 ml-4 ">
              <LatestProducts/>
              </div>

          
             
            </div>
            <div>
              </div>
          </div>
        )}


    
    </div>
  );
};

export default AdminDashboard;