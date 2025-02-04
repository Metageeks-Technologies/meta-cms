'use client'
import React from 'react'

import AdminAllProduct from './component/AdminProduct';
import VendorProduct from './component/VendorProduct';
import { StoreRole } from '@/constant/store';
import { useUserContext } from '@/context/userContext';



const page = () => {
    const {user} = useUserContext();

    return (
        <div>
            {
                user?.storeRole === StoreRole.SUPERADMIN || user?.storeRole === StoreRole.STOREMODERATOR ?
                    <AdminAllProduct />
                    :
                    <VendorProduct />
            }

        </div>
    )
}

export default page





