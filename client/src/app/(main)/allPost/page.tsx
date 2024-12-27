'use client'
import { ArrowUpRight, Check, CloudLightning } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/useAuth';
import axiosCall from '@/utils/ApiCall';
import AdminAllPost from './component/adminAllPost';
import ContributorAllPost from './component/contributorAllPost';



const page = () => {

    useAuth();

    const [userRole, setUserRole] = useState<any>();

    

    useEffect(() => {
        const userString = localStorage.getItem("user");
    
        if (userString) {
            const userRole = JSON.parse(userString).role;
            setUserRole(userRole);
            
        } else {
            console.log("No user data found in localStorage.");
        }
    }, [])

    return (
        <div>
            {
                userRole === "superadmin" || userRole === "moderator" ?
                    <AdminAllPost />
                    :
                    <ContributorAllPost />
            }

        </div>
    )
}

export default page
