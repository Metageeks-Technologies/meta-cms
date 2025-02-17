'use client'
import React from 'react'

import AdminAllProduct from './component/AdminProduct';
import VendorProduct from './component/VendorProduct';
import { useUserContext } from '@/context/userContext';
import { userRoles } from '@/constant/user';



const page = () => {
    const {user} = useUserContext();

    return (
        <div>
            {
                user?.role ===userRoles.SUPERADMIN  || user.role===userRoles.ADMIN  || user?.role ===userRoles.MODERATOR  ?
                    <AdminAllProduct />
                    :
                    <VendorProduct />
            }

        </div>
    )
}

export default page





