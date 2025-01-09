'use client'
import axiosCall from '@/utils/ApiCall';
import { Check } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import Card from './card';
import toast from 'react-hot-toast';
import { postStatuEnum } from '@/constant/post';
import { useUserContext } from '@/context/userContext';
import { debounce, filter } from 'lodash';

const ContributorAllPost = () => {

    const { loading, setLoading } = useUserContext();

    const [lastId, setLastId] = useState('');
    const [page, setPage] = useState({
        published: 1,
        draft: 1,
        scheduled: 1,
        rejected: 1,
        awaitApprove: 1,
        deleted: 1
    });
    const [hasMore, setHasMore] = useState({
        published: true,
        draft: true,
        scheduled: true,
        rejected: true,
        awaitApprove: true,
        deleted: true
    });

    // const [publishedHasMore, setPublishedHasMore]
    const [isFetching, setIsFetching] = useState(false);

    console.log(hasMore);


    const statusArr = [
        {
            label: 'Publish',
            query: postStatuEnum.PUBLISHED,
            function: fetchPublishedPost,
        },
        {
            label: 'Draft',
            query: postStatuEnum.DRAFT,
            function: fetchDraftPosts,
        },
        {
            label: 'Schedule',
            query: postStatuEnum.SCHEDULED,
            function: fetchSchedulePosts,
        },
        {
            label: 'Rejected',
            query: postStatuEnum.REJECTED,
            function: fetchRejectedPosts,
        },
        {
            label: 'Await approve',
            query: postStatuEnum.AWAITING_APPROVAL,
            function: fetchAwaitApprovePosts,
        },
        {
            label: 'Deleted',
            query: "deleted",
            function: fetchDeletedPosts,
        },
    ];


    const [filterBy, setFilterBy] = useState('published');

    // console.log(filterBy, "filterBy");
    const [sortBy, setSortBy] = useState('');
    // console.log(sortBy)
    const [postData, setPostData] = useState<any>(null);



    const handleSortByChange = (value: any) => {
        try {
            switch (filterBy) {
                case postStatuEnum.PUBLISHED:
                    fetchPublishedPost(value);
                    break;
                case postStatuEnum.DRAFT:
                    fetchDraftPosts(value);
                    break;
                case postStatuEnum.SCHEDULED:
                    fetchSchedulePosts(value);
                    break;
                case postStatuEnum.REJECTED:
                    fetchRejectedPosts(value);
                    break;
                case postStatuEnum.AWAITING_APPROVAL:
                    fetchAwaitApprovePosts(value);
                    break;
                case 'deleted':
                    fetchDeletedPosts(value);
                    break;
                default:
                    break;
            }

        } catch (error) {
            console.log(error);
        }

    }



    async function fetchPublishedPost(query?: string, lastId?: string) {
        if (isFetching || filterBy === postStatuEnum.PUBLISHED) return;
        setIsFetching(true);
        page.published === 1 && setLoading(true);
        if (filterBy !== postStatuEnum.PUBLISHED) setFilterBy(postStatuEnum.PUBLISHED);
        try {
            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/published?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, published: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }

    async function fetchDraftPosts(query?: string, lastId?: string) {
        if (isFetching || filterBy === postStatuEnum.DRAFT) return;

        setIsFetching(true);
        page.draft === 1 && setLoading(true);
        if (filterBy !== postStatuEnum.DRAFT) setFilterBy(postStatuEnum.DRAFT);
        try {
            const param = new URLSearchParams();

            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/drafts?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, draft: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }

    async function fetchSchedulePosts(query?: string, lastId?: string) {
        if (isFetching || filterBy === postStatuEnum.SCHEDULED) return;
        setIsFetching(true);
        page.scheduled === 1 && setLoading(true);
        if (filterBy !== postStatuEnum.SCHEDULED) setFilterBy(postStatuEnum.SCHEDULED);
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/scheduled?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, scheduled: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }

    async function fetchRejectedPosts(query?: string, lastId?: string) {
        if (isFetching || filterBy === postStatuEnum.REJECTED) return;
        setIsFetching(true);
        page.rejected === 1 && setLoading(true);
        if (filterBy !== postStatuEnum.REJECTED) setFilterBy(postStatuEnum.REJECTED);
        try {
            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/rejected?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, rejected: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);

            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            setIsFetching(false)
        }
    }

    async function fetchAwaitApprovePosts(query?: string, lastId?: string) {
        if (isFetching || filterBy === postStatuEnum.AWAITING_APPROVAL) return;
        setIsFetching(true);
        page.awaitApprove === 1 && setLoading(true);
        if (filterBy !== postStatuEnum.AWAITING_APPROVAL) setFilterBy(postStatuEnum.AWAITING_APPROVAL);
        try {
            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/awaiting-approval?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, awaitApprove: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }

    async function fetchDeletedPosts(query?: string, lastId?: string) {
        if (isFetching || filterBy === 'deleted') return;
        setIsFetching(true);
        page.deleted === 1 && setLoading(true);
        if (filterBy !== 'deleted') setFilterBy('deleted');
        try {

            const param = new URLSearchParams();
            if (query) param.append("sortBy", query);
            if (lastId) param.append("lastId", lastId);
            // param.append('isDeleted', 'false');

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/deleted?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                const newPost = resp?.data;
                if (newPost.length < 8) setHasMore({ ...hasMore, deleted: false });
                setPostData((prevData: any) => [...(prevData || []), ...newPost]);
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (hasMore) {
            if (filterBy === postStatuEnum.PUBLISHED) fetchPublishedPost(undefined, lastId);
            if (filterBy === postStatuEnum.DRAFT) fetchDraftPosts(undefined, lastId);
            if (filterBy === postStatuEnum.REJECTED) fetchPublishedPost(undefined, lastId);
            if (filterBy === postStatuEnum.AWAITING_APPROVAL) fetchAwaitApprovePosts(undefined, lastId);
            if (filterBy === postStatuEnum.SCHEDULED) fetchSchedulePosts(undefined, lastId);
            if (filterBy === 'deleted') fetchDeletedPosts(undefined, lastId);
        }
    }, [page.published, page.awaitApprove, page.deleted, page.draft, page.rejected, page.scheduled]);

    useEffect(() => {
        setPostData([]);
        // setPage({
        //     published: 1,
        //     draft: 1,
        //     scheduled: 1,
        //     rejected: 1,
        //     awaitApprove: 1,
        //     deleted: 1
        // });
        setLastId('');
        // setHasMore({
        //     published: true,
        //     draft: true,
        //     scheduled: true,
        //     rejected: true,
        //     awaitApprove: true,
        //     deleted: true
        // });
        if (filterBy === postStatuEnum.PUBLISHED) fetchPublishedPost();
        if (filterBy === postStatuEnum.DRAFT) fetchDraftPosts();
        if (filterBy === postStatuEnum.REJECTED) fetchPublishedPost();
        if (filterBy === postStatuEnum.AWAITING_APPROVAL) fetchAwaitApprovePosts();
        if (filterBy === postStatuEnum.SCHEDULED) fetchSchedulePosts();
        if (filterBy === 'deleted') fetchDeletedPosts();
    }, [filterBy, sortBy]);

    useEffect(() => {
        setLastId(postData?.[postData.length - 1]?._id || null);
    }, [postData]);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 // Trigger 100px before the bottom
        ) {
            if (filterBy === postStatuEnum.PUBLISHED) setPage({ ...page, published: page.published + 1 });
            if (filterBy === postStatuEnum.DRAFT) setPage({ ...page, draft: page.draft + 1 });
            if (filterBy === postStatuEnum.REJECTED) setPage({ ...page, rejected: page.rejected + 1 });
            if (filterBy === postStatuEnum.AWAITING_APPROVAL) setPage({ ...page, awaitApprove: page.awaitApprove + 1 });
            if (filterBy === postStatuEnum.SCHEDULED) setPage({ ...page, scheduled: page.scheduled + 1 });
            if (filterBy === 'deleted') setPage({ ...page, deleted: page.deleted + 1 });
        }
    },[filterBy, hasMore, isFetching, page]);

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll); // Cleanup listener
    }, []);


    return (
        <div>
            <div className='w-full flex flex-row flex-wrap gap-2 sm:gap-4 lg:gap-8  px-2 ms:px-8 mt-6 md:mt-12'>
                <div className='flex gap-2 flex-row items-center flex-wrap text-xs sm:text-sm'>
                    {
                        statusArr.map((status, index) => (
                            <div key={index} onClick={() => status.function()} className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${filterBy == status.query ? "text-blue-800 border-blue-800" : ""}`}>
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
                    <select onChange={(e) => handleSortByChange(e.target.value)} name="" id="" className='w-60 bg-[#06040B] border-[1px] border-gray-800 px-2 py-1 sm:p-3 rounded-lg outline-none'>
                        <option value="">-- Sort by --</option>
                        {/* <option value="trending">Trending</option> */}
                        <option value="popular">Popular</option>
                        <option value="recent">Recent</option>
                        <option value="oldest">Oldest</option>
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
                    (filterBy === postStatuEnum.PUBLISHED && hasMore.published) ||
                    (filterBy === postStatuEnum.DRAFT && hasMore.draft) ||
                    (filterBy === postStatuEnum.AWAITING_APPROVAL && hasMore.awaitApprove) ||
                    (filterBy === postStatuEnum.REJECTED && hasMore.rejected) ||
                    (filterBy === postStatuEnum.SCHEDULED && hasMore.scheduled) ||
                    (filterBy === 'deleted' && hasMore.deleted) ||
                    loading ? (
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
                ) : null
            }

        </div>
    )
}

export default ContributorAllPost