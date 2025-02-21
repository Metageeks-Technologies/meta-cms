'use client'
import React from 'react'

import OrderTable from './component/OrderTable';
import VendorOrder from './component/VendorTable';

import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';



const page = () => {
    const {user} = useUserContext();

    return (
        <div>
            {
                user?.role === userRoles.SUPERADMIN  || user?.role===userRoles.ADMIN || user?.role === userRoles.MODERATOR ?
                    <OrderTable />
                    :
                    <VendorOrder />
            }

        </div>
    )
}

export default page
