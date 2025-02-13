'use client'
import axiosCall from '@/utils/ApiCall';
import { Check, Underline } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import Card from './card';
import toast from 'react-hot-toast';
import { postSortByEnum, postStatuEnum, statusArrAdminAllPost } from '@/constant/post';
import { useUserContext } from '@/context/userContext';
import { debounce, filter } from 'lodash';
import { usePostContext } from '@/context/postContext';

const ContributorAllPost = () => {

    const { loading, setLoading, user, websiteKey } = useUserContext();

    const { filterBy, setFilterBy, sortBy, setSortBy, selectedCategory, setSelectedCategory } = usePostContext();

    const [lastId, setLastId] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [isFetching, setIsFetching] = useState(false);
    const [postData, setPostData] = useState<any>(null);
    const [category, setCategory] = useState([]);


    const fetchPostByStatus = async (status: string, param: URLSearchParams,) => {
        if (!websiteKey) return toast.error("Website key required", { duration: 2000 });
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/${status}?${param.toString()}`, undefined, { websiteKey });
            console.log(resp.data)
            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 10) setHasMore(false);
                setPostData((prevData: any) => {
                    const updatedData = [...(prevData || [])];
                    newPost.forEach((post: any) => {
                        if (!updatedData.some((existingPost: any) => existingPost._id === post._id)) {
                            updatedData.push(post);
                        }
                    });
                    return updatedData;
                });
                            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
                setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function fetchPosts(lastId?: string) {
        if (isFetching) return;
        setIsFetching(true);
        page === 1 && setLoading(true);

        try {
            const param = new URLSearchParams();
            if (sortBy) param.append('sortBy', sortBy);
            if (lastId) param.append('lastId', lastId);
            if (selectedCategory) param.append('categories', selectedCategory);
            if (filterBy !== postStatuEnum.DELETED) param.append('isDeleted', 'false');

            if (filterBy === "") await fetchPostByStatus("all", param);

            if (filterBy === postStatuEnum.PUBLISHED) await fetchPostByStatus(postStatuEnum.PUBLISHED, param);

            if (filterBy === postStatuEnum.DRAFT) await fetchPostByStatus(postStatuEnum.DRAFT, param);

            if (filterBy === postStatuEnum.AWAITING_APPROVAL) await fetchPostByStatus(postStatuEnum.AWAITING_APPROVAL.split(" ").join("-"), param);

            if (filterBy === postStatuEnum.REJECTED) await fetchPostByStatus(postStatuEnum.REJECTED, param);

            if (filterBy === postStatuEnum.SCHEDULED) await fetchPostByStatus(postStatuEnum.SCHEDULED, param);

            if (filterBy === postStatuEnum.DELETED) await fetchPostByStatus(postStatuEnum.DELETED, param);

        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`, undefined, { websiteKey });

            if (resp.status === 200 || resp.status === 201) {
                setCategory(resp.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 // Trigger 100px before the bottom
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll); // Cleanup listener
    }, []);


    useEffect(() => {
        if (hasMore && websiteKey) fetchPosts(lastId);
    }, [page, hasMore, websiteKey]);

    useEffect(() => {
        if (user.role) {
            setPostData([]);
            setPage(1);
            setLastId('');
            setHasMore(true);
            fetchPosts();
        }
    }, [filterBy, sortBy, selectedCategory]);

    useEffect(() => {
        setLastId(postData?.[postData.length - 1]?._id || null);
    }, [postData]);

    useEffect(() => {
        if (websiteKey) fetchCategory();
    }, [websiteKey])

    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8  px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {
                        statusArrAdminAllPost.map((status, index) => (
                            <div key={index} onClick={() => setFilterBy(status.query)} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy == status.query ? "text-blue-800 border-blue-800" : ""}`}>
                                {
                                    filterBy === status.query ?
                                        <Check className='w-4 h-4 sm:w-6 sm:h-6' />
                                        : null
                                }
                                <span>{status.label}</span>
                            </div>
                        ))
                    }

                </div>

                <div className='flex flex-row items-center'>
                    <select onChange={(e) => setSortBy(e.target.value)} name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
                        <option value="">-- Sort by --</option>
                        {/* <option value="trending">Trending</option> */}
                        <option value={postSortByEnum.POPULAR}>Popular</option>
                        <option value={postSortByEnum.RECENT}>Recent</option>
                        <option value={postSortByEnum.OLDEST}>Oldest</option>
                    </select>
                </div>

                <div className='flex flex-row items-center'>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
                        <option value="">-- Select Category --</option>
                        {
                            category.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))
                        }
                    </select>
                </div>

            </div>

            <div className='w-full h-full flex flex-row flex-wrap items-start justify-center gap-5 p-4'>

                {
                    postData ?
                        (
                            <div className='flex flex-row flex-wrap items-start justify-center gap-5 '>
                                {
                                    postData.length > 0 ?
                                        postData.map((post: any, index: number) => (
                                            <Card key={index} index={index} post={post} />
                                        ))
                                        : <p className='mt-10 text-3xl '>No posts found.</p>
                                }
                            </div>
                        )
                        : <p className='mt-10 text-xl'>Loading...</p>
                }

            </div>


            {
                (hasMore && !loading) &&
                <div aria-label="Loading..." role="status" className="flex items-center justify-center space-x-2">
                    <svg className="h-10 w-10 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                        <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="24"></line>
                        <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                        </line>
                        <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="24"></line>
                        <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                        </line>
                        <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="24"></line>
                        <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
                        </line>
                    </svg>
                    <span className="text-xl font-medium text-gray-500">Loading...</span>
                </div>
            }

        </div>
    )
}

export default ContributorAllPost