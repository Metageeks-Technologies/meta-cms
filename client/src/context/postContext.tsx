'use client'
import axiosCall from "@/utils/ApiCall";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./userContext";
import { PostContextType } from "@/types";

const postContext = createContext<any>(null);



export const PostProvider = ({ children }: { children: React.ReactNode }) => {

    const { setLoading } = useUserContext();

    const [categories, setCategeories] = useState([]);
    const [media, setMedia] = useState<any>([]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
            if (resp?.status === 200 || resp?.status === 201) {
                setCategeories(resp?.data.reverse());
            } else {
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const deleteCategory = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`);

            if (resp.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                fetchCategories();
            } else {
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchMedia = async (lastId: string) => {
        setLoading(true);
        try {
            const param = new URLSearchParams();
            if (lastId) param.append('lastId', lastId);
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/media?${param.toString()}`);

            // console.log(resp, "Response");

            if (resp.status === 200 || resp.status === 201) {
                setMedia(resp.data);
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const contextValues: PostContextType = {
        categories,
        fetchCategories,
        deleteCategory,
        fetchMedia,
        media
    }

    return (
        <postContext.Provider value={contextValues}>
            {children}
        </postContext.Provider>
    )
}

export const usePostContext = () => {
    const context = useContext(postContext);
    if (!context) {
        throw new Error("usePostContext must be used within a PostProvider");
    }
    return context;
}
