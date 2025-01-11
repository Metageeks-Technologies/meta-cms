'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import { postSortByEnum, postStatuEnum } from '@/constant/post';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { handleDate } from '@/utils/helperFunction';
import { useUserContext } from '@/context/userContext';
import { getURL } from '@/utils/AWS_Config';


const MyRecentPosts = () => {

    const router = useRouter();
    const {setLoading, user} = useUserContext();
    const [posts, setPosts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function stripHTML(html: any) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    function PreviewHTML(description: any,) {
        const sanitizedHTML = DOMPurify.sanitize(description);
        const plainText = stripHTML(sanitizedHTML);
        const previewText = plainText.slice(0, 250) + (plainText.length > 250 ? '...' : '');
        return previewText;
    }


    const fetchUserAllRecentPublishedPosts = async () => {
        setLoading(true);
        setIsLoading(true);
        try {
            const param = new URLSearchParams();
            param.append('status', postStatuEnum.PUBLISHED);
            param.append('sortBy', postSortByEnum.RECENT);

            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/posts/my/all?${param.toString()}`);

            if (resp.status === 200 || resp.status === 201) {
                setPosts(resp?.data?.slice(0,10));
                
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.role) fetchUserAllRecentPublishedPosts();
    }, [user])


    return (
        <div className="w-[97%] text-white p-6 rounded-lg mx-auto border-[1px] border-gray-800 mt-5">
            <h2 className="text-2xl font-bold mb-6 mt-2 text-center">My Recent Published Posts</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto styledScrollable">
                {!isLoading ? (

                    posts.length > 0 ?
                        posts.map((post: any, index: number) => (
                            <div
                                key={index}
                                className="p-4 shadow-md flex gap-4 items-start border-b-[1px] border-gray-800 group cursor-pointer "
                                onClick={() => router.push(`/post/${post.slug}`)}
                            >
                                <div className="w-[200px] h-[130px]">
                                    <img src={getURL(post.previewImageKey)} alt="" className='w-full h-full object-cover rounded-lg'/>
                                    {/* <img src="/blogImg.png" alt="" className='w-full object-cover rounded-lg' /> */}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold group-hover:underline">{post.title.length > 75 ? `${post.title.slice(0, 75)}...` : post.title}</h3>

                                    <p className="text-gray-400 mt-1 text-sm">
                                        {PreviewHTML(post.description)}
                                    </p>

                                    <p className="text-gray-400 text-sm mt-2">
                                        By <span className="text-white">{post.author.name}</span> · {handleDate(post.publishedDate)}
                                    </p>
                                    <p className="text-green-400 text-sm mt-2">Likes: {post.likesCount}</p>
                                </div>
                            </div>
                        ))
                        : <p className='text-center'>No Post Found</p>
                ) : (
                    <p className='text-center'>Loading...</p>
                )}
            </div>
        </div>
    )
}

export default MyRecentPosts