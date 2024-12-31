'use client'
import { userRoles } from "@/constant/user";
import { useContext, useEffect, useState } from "react";
import AdminDashboard from "./_components/adminDashboard";
import ContributorDashboard from "./_components/contributorDashboard";
import { useUserContext } from "@/context/userContext";



export default function page() {
  const {user} = useUserContext();

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
