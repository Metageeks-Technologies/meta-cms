'use client'
import { ArrowUpRight, Check, CloudLightning } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/useAuth';
import axiosCall from '@/utils/ApiCall';
import AdminAllPost from './component/adminAllPost';
import ContributorAllPost from './component/contributorAllPost';
import { getUserFromLocalStorage } from '@/utils/helperFunction';
import { userRoles } from '@/constant/user';



const page = () => {

    useAuth();

    const [user, setUser] = useState<any>();

    useEffect(() => {
        getUserFromLocalStorage(setUser);
    }, [])

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
