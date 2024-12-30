'use client'
import { userRoles } from "@/constant/user";
import { useAuth } from "@/hooks/useAuth";
import { getUserFromLocalStorage } from "@/utils/helperFunction";
import { useEffect, useState } from "react";
import AdminDashboard from "./_components/adminDashboard";
import ContributorDashboard from "./_components/contributorDashboard";



export default function page() {
  useAuth();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    getUserFromLocalStorage(setUser);
  },[]);

  return (
    <div>
      {
        user?.role === userRoles.SUPERADMIN || user?.role === userRoles.MODERATOR?
          <AdminDashboard />
          :
          <ContributorDashboard />
      }
    </div>
  );
}
