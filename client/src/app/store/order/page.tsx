'use client'
import React from 'react'

import OrderTable from './component/OrderTable';
import VendorOrder from './component/VendorTable';

import { userRoles } from '@/constant/user';
import { StoreRole } from '@/constant/store';
import { useUserContext } from '@/context/userContext';



const page = () => {
    const {user} = useUserContext();

    return (
        <div>
            {
                user?.storeRole === StoreRole.SUPERADMIN || user?.storeRole === StoreRole.STOREMODERATOR ?
                    <OrderTable />
                    :
                    <VendorOrder />
            }

        </div>
    )
}

export default page
