'use client'
import { createContext, useContext, useState } from "react";
import { useUserContext } from "./userContext";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import { WebsiteContextTypes } from "@/types";


const WebsiteContext = createContext<WebsiteContextTypes | null>(null);



export const WebsiteProvider = ({ children }: any) => {

    const { setLoading } = useUserContext();
    const [websiteData, setWebsiteData] = useState([]);
    const [websitePageNo, setWebsitePageNo] = useState(1);

    const deleteWebsite = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/website/${id}`)
            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, { duration: 2000 });
                fetchWebsiteData();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log("Error in delete website : ", error);
        } finally {
            setLoading(false);
        }
    }

    const recoverWebsite = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/website/recover/${id}`)
            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                fetchWebsiteData();
            } else {
                toast.error(resp.data.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in recover website : ", error);
        } finally {
            setLoading(false);
        }
    }

    const updateWebsite = async (e: any, website: any, setIsOpen: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: website.name,
                permissions: website.permissions,
            }
            const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/website/${website._id}`, payload);
            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                fetchWebsiteData();
                setIsOpen(false);
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log("Error in updating website : ", error);
        } finally {
            setLoading(false);
        }
    }


    const fetchWebsiteData = async (searchQuery?: string) => {
        setLoading(true);
        try {
            const param = new URLSearchParams();
            param.append('page', websitePageNo.toString())
            if (searchQuery) {
                param.append('search', searchQuery)
            }
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/website/all?${param.toString()}`)

            if (resp.status === 200 || resp.status === 201) {
                setWebsiteData(resp?.data);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in fetching websites : ", error);
        } finally {
            setLoading(false)
        }
    }


    const contextValue: WebsiteContextTypes = {
        deleteWebsite,
        recoverWebsite,
        updateWebsite,
        fetchWebsiteData,
        websiteData,
        websitePageNo,
        setWebsitePageNo
    }


    return (
        <WebsiteContext.Provider value={contextValue}>
            {children}
        </WebsiteContext.Provider>
    )
}

export const useWebsiteContext = () => {
    const context = useContext(WebsiteContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}