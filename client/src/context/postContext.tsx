'use client'
import axiosCall from "@/utils/ApiCall";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./userContext";
import { PostContextType } from "@/types";

const postContext = createContext<any>(null);



export const PostProvider = ({ children }: { children: React.ReactNode }) => {

    const { setLoading, websiteKey } = useUserContext();

    const [filterBy, setFilterBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('')

    const [selectedProductCategory, setSelectedProductCategory] = useState('');

    const [categories, setCategeories] = useState([]);

    const [productCategories, setProductCategories] = useState([]);

    const [media, setMedia] = useState<any>([]);
    const [hasMoreMedia, setHasMoreMedia] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`, undefined, { websiteKey })
            if (resp?.status === 200 || resp?.status === 201) {
                setCategeories(resp?.data);
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

    const fetchProductCategories = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories`)
            if (resp?.status === 200 || resp?.status === 201) {
                setProductCategories(resp?.data);
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

    const deleteCategory = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`, undefined, { websiteKey });

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


    const deleteProductCategory = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories/${id}`, undefined, { websiteKey });

            if (resp.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, {
                    duration: 2000,
                });
                fetchProductCategories();
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
        if (isFetching) return;
        setIsFetching(true);
        if(!lastId){
            setMedia([]);
        }
        try {
            const param = new URLSearchParams();
            if (lastId) param.append('lastId', lastId);
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/media?${param.toString()}`, undefined, { websiteKey });


            if (resp.status === 200 || resp.status === 201) {
                const newMedia = resp?.data;
                if (newMedia.length < 10) setHasMoreMedia(false);
                setMedia([...media, ...newMedia]);
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    }

    const contextValues: PostContextType = {
        categories,
        productCategories,
        fetchCategories,
        deleteCategory,
        fetchMedia,
        media,
        setMedia,
        hasMoreMedia,
        isFetching,
        filterBy,
        setFilterBy,
        sortBy,
        setSortBy,
        selectedCategory,
        setSelectedCategory,
        selectedProductCategory,
        setSelectedProductCategory,
        fetchProductCategories,
        deleteProductCategory,
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
