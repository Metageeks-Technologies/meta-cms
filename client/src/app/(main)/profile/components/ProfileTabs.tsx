import React, { useEffect, useState } from 'react'
import Addresses from './Addresses'
import Orders from './Orders';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';

const ProfileTabs = () => {

  const [tab, setTab] = useState(1);

  const { loading, setLoading } = useUserContext();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const getUserAddresses = async () => {
      setLoading(true);
      try {
          const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/address`)

          // console.log(resp, "Response in address")

          if (resp.status === 200 || resp.status === 201) {
              setAddresses(resp?.data)
          }

      } catch (error) {
          console.log("Error in fetch user address : ", error);
      } finally {
          setLoading(false);
      }
  }

  const getUserOrders = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/order/my`)

      console.log(resp, "Response in orders")

      if (resp.status === 200 || resp.status === 201) {
          setOrders(resp?.data)
      }
    } catch (error) {
      console.log("Error in fetching user orders : ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      getUserAddresses();
      getUserOrders();
  }, []);

  return (
    <div>
      <div className='flex flex-row gap-5 my-10'>
        <button onClick={() => setTab(1)} className={`font-bold px-5 py-2 ${tab === 1 ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}>Address</button>
        <button onClick={() => setTab(2)} className={`font-bold px-5 py-2 ${tab === 2 ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}>Orders</button>
      </div>

      {
        tab === 1 ?
          <Addresses addresses={addresses}/>
          : tab === 2 ?
            <Orders orders={orders}/>
            : null
      }
    </div>
  )
}

export default ProfileTabs