'use client'
import React from 'react'

import AdminAllPost from './component/adminAllPost';
import ContributorAllPost from './component/contributorAllPost';
import { userRoles } from '@/constant/user';
import { useUserContext } from '@/context/userContext';



const page = () => {
    const {user} = useUserContext();

    return (
        <div>
            {
                user?.role === userRoles.SUPERADMIN || user?.role === userRoles.MODERATOR ?
                    <AdminAllPost />
                    :
                    <ContributorAllPost />
            }

        </div>
    )
}

export default page
