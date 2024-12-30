'use client'
import axiosCall from "@/utils/ApiCall";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const postContext =  createContext<any>(null);


export const PostProvider = ({children}: {children: React.ReactNode}) => {

    const [categories, setCategeories] = useState([
        {
            name: "category name",
            bannerImageKey: "image.png",
            description: "Category description",
        }
    ]);

    const fetchCategories = async() => {
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`) 
            if(resp?.status === 200 || resp?.status === 201) {
                setCategeories(resp?.data.reverse());
            }else{
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteCategory = async(id: string) => {
        try {
            toast.loading('Loading...');
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`) ;

            if(resp.status === 200 || resp?.status === 201) {
                toast.dismiss();
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                fetchCategories();
            }else{
                toast.dismiss();
                toast.error(resp?.data?.message, {
                    duration: 2000,
                });
            }
            
        } catch (error) {
            toast.dismiss();
            console.log(error);
        }
    }


    return (
        <postContext.Provider value={{categories, fetchCategories, deleteCategory}}>
            {children}
        </postContext.Provider>
    )

}

export const usePostContext = () => {
    const context = useContext(postContext);
    if(!context){
        throw new Error("usePostContext must be used within a PostProvider");
    }
    return context;
}
