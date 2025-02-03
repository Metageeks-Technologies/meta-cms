'use client'
import axiosCall from "@/utils/ApiCall";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./userContext";
import { ProductContextType } from "@/types";

const productContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {

    const { setLoading } = useUserContext();

    const [filterBy, setFilterBy] = useState('');
    const [sortBy, setSortBy] = useState('');
        const [selectedCategory, setSelectedCategory] = useState('')
    
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [productCategories, setProductCategories] = useState<any[]>([]);

    const fetchProductCategories = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories`);
            if (resp?.status === 200 || resp?.status === 201) {
                setProductCategories(resp?.data);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProductCategory = async (id: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories/${id}`);
            if (resp.status === 200 || resp?.status === 201) {
                toast.success(resp?.data?.message, { duration: 2000 });
                fetchProductCategories();
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const contextValues: ProductContextType = {
        productCategories,
        filterBy,
        setFilterBy,
        sortBy,
        setSortBy,
        selectedProductCategory,
        selectedCategory,
        setSelectedCategory,
        setSelectedProductCategory,
        fetchProductCategories,
        deleteProductCategory
    };

    return (
        <productContext.Provider value={contextValues}>
            {children}
        </productContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(productContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
};
