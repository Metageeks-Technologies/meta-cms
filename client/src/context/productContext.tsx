'use client'
import axiosCall from "@/utils/ApiCall";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./userContext";
import { ProductContextType } from "@/types";
import { productStatusFilters } from "@/constant/product";


const productContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {

    const { setLoading, websiteKey } = useUserContext();


    const [filterBy, setFilterBy] = useState(productStatusFilters[0].query);
    const [sortBy, setSortBy] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [productCategories, setProductCategories] = useState<any[]>([]);
    const [productCategoryPageNo, setProductCategoryPageNo] = useState(1);



    const fetchProductCategories = async () => {
        setLoading(true);
        try {
            const param = new URLSearchParams();
            param.append('page', productCategoryPageNo.toString())
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories?${param.toString()}`, undefined, { websiteKey })

            console.log(resp.data)
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
            const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories/${id}`, undefined, { websiteKey });
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
        deleteProductCategory,
        productCategoryPageNo,
        setProductCategoryPageNo
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
