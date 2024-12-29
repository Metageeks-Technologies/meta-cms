'use client'
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import { userRoles } from "@/constant/user";

const UserContext: any = createContext(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [subscriber, setSubscriber] = useState([
        {
            name: "user",
            email: "user@gmail.com",
            phoneNo: 9999999999,
            role: "subscriber",
        }
    ]);

    const [contributor, setContributor] = useState([
        {
            name: "user",
            email: "user@gmail.com",
            phoneNo: 9999999999,
            role: "subscriber",
        }
    ]);

    const [moderator, setModerator] = useState([
        {
            name: "user",
            email: "user@gmail.com",
            phoneNo: 9999999999,
            role: "subscriber",
        }
    ]);

    const fetchAllSubscriber = async () => {
        try {
            toast.loading("Loading...");
            const resp = await axiosCall("get", `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-subscribers`);
            if (resp?.status === 200 || resp?.status === 201) {
                toast.dismiss();
                setSubscriber(resp?.data?.users);
            } else {
                toast.dismiss();    
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch subscribers!");
        }
    };

    const fetchAllContributor = async () => {
        try {
            toast.loading("Loading...");
            const resp = await axiosCall("get", `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-contributor`);
            if (resp?.status === 200 || resp?.status === 201) {
                toast.dismiss();
                setContributor(resp?.data?.users);
            } else {
                toast.dismiss();    
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch contributor!");
        }
    };

    const fetchAllModerator = async () => {
        try {
            toast.loading("Loading...");
            const resp = await axiosCall("get", `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-moderator`);
            if (resp?.status === 200 || resp?.status === 201) {
                toast.dismiss();
                setModerator(resp?.data?.users);
            } else {
                toast.dismiss();    
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch moderator!");
        }
    };

    const changeUserRole = async (id: string, currentRole: string, newRole: string) => {
        try {
          toast.loading('Loading...');
          const payload = {
            "_id": id,
            "newRole": newRole
          }
          const resp = await axiosCall('put', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-role`, payload);

          if(resp.status === 200 || resp.status === 201) {
            if(currentRole === userRoles.MODERATOR){
                fetchAllModerator();
            }
            if(currentRole === userRoles.CONTRIBUTOR){
                fetchAllContributor();
            }
            if(currentRole === userRoles.SUBSCRIBER){
                fetchAllSubscriber();
            }
            toast.dismiss();
            toast.success(resp.data.message, {
              duration: 2000,
            });
          }else{
            toast.error(resp.data.message, {
              duration: 2000,
            });
          }

        } catch (error) {
          console.log(error);
        }
      }

    useEffect(() => {
        fetchAllSubscriber();
        fetchAllContributor();
        fetchAllModerator();
    }, []);

    return (
        <UserContext.Provider value={{ subscriber, fetchAllSubscriber, contributor, fetchAllContributor, moderator, fetchAllModerator, changeUserRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
