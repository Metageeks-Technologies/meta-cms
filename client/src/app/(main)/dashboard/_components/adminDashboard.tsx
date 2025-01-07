import React, { useEffect, useState } from 'react';
import CardsRow from './CardsRow';
import Chart from './Chart';
import RecentPosts from './RecentPosts';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';
import MyRecentPosts from './MyRecentPosts';

const AdminDashboard = () => {

  const { user, setLoading } = useUserContext();

  const [personalDashboardData, setPersonalDashboardData] = useState();
  const [globalDashboardData, setGlobalDashboardData] = useState();


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
    </div>
  );
};

export default AdminDashboard;