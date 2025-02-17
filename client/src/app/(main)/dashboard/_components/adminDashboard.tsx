import React, { useEffect, useState } from 'react';
import CardsRow from './CardsRow';
import Chart from './Chart';
import RecentPosts from './RecentPosts';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';
import MyRecentPosts from './MyRecentPosts';
import StoreDashboard from '@/app/store/Dashboard/StoreDashboard';

const AdminDashboard = () => {

  const { user, setLoading, website, websiteKey } = useUserContext();

  const [personalDashboardData, setPersonalDashboardData] = useState();
  const [globalDashboardData, setGlobalDashboardData] = useState();

  const [isBlogDashboard, setIsBlogDashboard] = useState(true); // State to toggle between dashboards


  const dashboardGlobal = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin/global`, undefined, { websiteKey: websiteKey });

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
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin/personal`, undefined, { websiteKey: websiteKey })

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
    if (websiteKey) {
      dashboardPersonal();
      dashboardGlobal();
    }
  }, [websiteKey]);


  return (
    <div className="container mx-auto p-2">

      <h1 className='text-3xl font-bold my-4'>{website?.name}</h1>

      <div className="flex justify-start my-5">
        {
          user?.website?.permissions.includes('blog') || website?.permissions?.includes('blog') &&
          <button
            onClick={() => setIsBlogDashboard(true)}
            className={`font-bold px-5 py-2 cursor-pointer ${isBlogDashboard ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}        >
            Blog Dashboard
          </button>
        }
        {
          user?.website?.permissions.includes('store') || website?.permissions?.includes('store') &&
          <button
            onClick={() => setIsBlogDashboard(false)}
            className={`font-bold px-5 py-2 cursor-pointer ${!isBlogDashboard ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}        >
            Store Dashboard
          </button>
        }
      </div>


      {isBlogDashboard ? (

        (user?.website?.permissions.includes('blog') || website?.permissions?.includes('blog')) ?
          <>
            {
              (user?.role === userRoles.SUPERADMIN || user?.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) ?
                <CardsRow data={globalDashboardData} personalData={personalDashboardData} />
                : <CardsRow data={personalDashboardData} />
            }
            {
              (user?.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) &&
              <RecentPosts />
            }
            <MyRecentPosts />

            <div className={`
        ${(user?.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) ? "w-[97%]" : "w-[50%]"}
        mx-auto flex flex-row items-center gap-5 mt-20`}>
              {
                (user?.role === userRoles.SUPERADMIN || user.role === userRoles.ADMIN || user.role === userRoles.MODERATOR) &&
                <Chart heading="Global Monthly Posts" data={globalDashboardData} />
              }
              <Chart heading="My Monthly Posts" data={personalDashboardData} />
            </div>
          </>

          : <div className='text-center my-20'>
            <h1 className='text-3xl font-bold'>You don’t have permission to access this dashboard.</h1>
            <h3 className='text-gray-400 font-bold'>Please contact the administrator for assistance.</h3>
          </div>
      ) : (
        (user?.website?.permissions.includes('store') || website?.permissions?.includes('store')) ?
          <StoreDashboard />
          : <div className='text-center my-20'>
            <h1 className='text-3xl font-bold'>You don’t have permission to access this dashboard.</h1>
            <h3 className='text-gray-400 font-bold'>Please contact the administrator for assistance.</h3>
          </div>
      )}



    </div>
  );
};

export default AdminDashboard;