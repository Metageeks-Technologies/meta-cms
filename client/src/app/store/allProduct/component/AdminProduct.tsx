'use client';

import React, { useEffect, useState } from 'react';
import axiosCall from '@/utils/ApiCall';
import { Check } from 'lucide-react';
import ProductCard from '@/app/store/allProduct/component/ProductCard';
import { useUserContext } from '@/context/userContext';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { useProductContext } from '@/context/productContext';
import { productStatusFilters } from '@/constant/product';

const AdminAllProduct = () => {
    const { user } = useUserContext();
    const { filterBy, sortBy, setFilterBy, setSortBy, selectedCategory, setSelectedCategory } = useProductContext();

    const [category, setCategory] = useState([]);
    const [productData, setProductData] = useState<any>(null);
    const { loading, setLoading } = useUserContext();
    const [lastId, setLastId] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Product-specific status filters
   

    async function fetchAllProducts(lastId?: string) {
        if (isFetching) return;
        setIsFetching(true);
        page === 1 && setLoading(true);
    
        try {
            const param = new URLSearchParams();
            
            // Check filter for deleted products
            if (filterBy) {
                if (filterBy === 'deleted') {

                    if (selectedCategory) {
                        param.append('categoryId', selectedCategory);  // Add categoryId if selected
                    }
                    // Use the new API endpoint for deleted products
                    const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/products/all/delete?${param.toString()}`);
                    if (resp.status === 200 || resp.status === 201) {
                        const deletedProducts = resp?.data;
                        if (deletedProducts.length < 20) setHasMore(false);
                        setProductData((prevData: any) => {
                            const updatedData = [...(prevData || [])];
                            deletedProducts.forEach((product: any) => {
                                if (!updatedData.some((existingProduct: any) => existingProduct._id === product._id)) {
                                    updatedData.push(product);
                                }
                            });

                            return updatedData;
                        });
                    } else {
                        toast.error(resp.data.message, { duration: 2000 });
                        setHasMore(false);
                    }

                    return; // Exit early for deleted filter
                } else if (filterBy !== 'all') {
                    param.append('status', filterBy.toLowerCase());
                    param.append('isDeleted', 'false');
                }
            }
    
            // Default behavior for active products
            if (sortBy) param.append('sortBy', sortBy);
            if (lastId) param.append('lastId', lastId);
            if (selectedCategory) param.append('categoryId', selectedCategory);  
            if (searchText) param.append('searchQuery', searchText);
    
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/products/all?${param.toString()}`);
    
            if (resp.status === 200 || resp.status === 201) {
                const newProducts = resp?.data;
                if (newProducts.length < 10) setHasMore(false);
                setProductData((prevData: any) => {
                    const updatedData = [...(prevData || [])];
                    newProducts.forEach((product: any) => {
                        if (!updatedData.some((existingProduct: any) => existingProduct._id === product._id)) {
                            updatedData.push(product);
                        }
                    });
                    return updatedData;
                });
            } else {
                toast.error(resp.data.message, { duration: 2000 });
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }
    

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories`);
            if (resp.status === 200 || resp.status === 201) {
                setCategory(resp.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSetSearchText = debounce((value: string) => {
        setSearchText(value);
    }, 900);

    const handleSearch = async (e: any) => {
        const { value } = e.target;
        debouncedSetSearchText(value);
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 && !isFetching && hasMore
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, []);

    useEffect(() => {
        if (hasMore && user.role) {
            fetchAllProducts(lastId);
        }
    }, [page, hasMore]);

    useEffect(() => {
        if (user.role) {
            setProductData([]); // Clear previous data on filter or sort change
            setPage(1);
            setLastId('');
            setHasMore(true);
            fetchAllProducts();
        }
    }, [filterBy, sortBy, selectedCategory, searchText]);

    useEffect(() => {
        setLastId(productData?.[productData.length - 1]?._id || null);
    }, [productData]);

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8 px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {productStatusFilters.map((status, index) => (
                        <div
                            key={index}
                            onClick={() => setFilterBy(status.query)}
                            className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy === status.query ? 'text-blue-800 border-blue-800' : ''}`}
                        >
                            {filterBy === status.query ? <Check className='w-4 h-4 sm:w-6 sm:h-6' /> : null}
                            <span>{status.label}</span>
                        </div>
                    ))}
                </div>

                <div className='flex flex-row items-center'>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'
                    >
                        <option value="">-- Sort by --</option>
                        <option value="popular">Popular</option>
                        <option value="recent">Recent</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                <div className='flex flex-row items-center'>
                    <select
                        value={selectedCategory}
                        name="" id="" 

                        onChange={(e) => setSelectedCategory(e.target.value)}
                    

                        className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'
                    >
                        <option value="">-- Select Category --</option>
                        {category.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {filterBy === ''  && (
                    <div>
                        <input
                            type="text"
                            className='bg-transparent px-3 py-[10px] border-[1px] border-gray-800 rounded-lg outline-none'
                            placeholder='Search...'
                            onChange={handleSearch}
                        />
                    </div>
                )}
            </div>

            <div className='w-full h-full flex flex-row flex-wrap items-start justify-center gap-5 p-4'>
                {productData && !loading ? (
                    <div className='flex flex-row flex-wrap items-start justify-center gap-5'>
                        {productData.length > 0 ? (
                            productData.map((product: any, index: number) => (
                                <ProductCard key={index} product={product} />
                            ))
                        ) : (
                            <p className='mt-10 text-3xl'>No products found.</p>
                        )}
                    </div>
                ) : null}
            </div>

            {(hasMore && !loading) && (
                <div aria-label="Loading..." role="status" className="flex items-center justify-center space-x-2">
                    <svg className="h-10 w-10 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                        <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                    </svg>
                    <span className="text-xl font-medium text-gray-500">Loading...</span>
                </div>
            )}
        </div>
    );
};

export default AdminAllProduct;
