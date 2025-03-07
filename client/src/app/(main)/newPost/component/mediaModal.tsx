'use client'
import React, { useEffect, useRef, useState } from 'react'
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { uploadToS3 } from '@/utils/helperFunction';
import { useUserContext } from '@/context/userContext';
import { usePostContext } from '@/context/postContext';
import { getURL } from '@/utils/AWS_Config';
import { debounce } from 'lodash';
import Image from 'next/image';


interface MediaPageProps {
  onSelectImage: (imageUrl: string) => void;
  setIsMediaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaModal: React.FC<MediaPageProps> = ({ onSelectImage, setIsMediaModalOpen }) => {

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { loading, setLoading, websiteKey } = useUserContext();
  const { media, setMedia, fetchMedia, hasMoreMedia, isFetching } = usePostContext();



  const uploadNewFile = async (fileList: FileList | null) => {
    if (!websiteKey) return toast.error("Website key is required", { duration: 2000 })
    try {
      setLoading(true);

      const payload = {
        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS,
        fileName: fileList?.[0].name,
        contentType: fileList?.[0].type
      }
      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload, { websiteKey });


      if (resp.status === 200 || resp.status === 201) {
        uploadToS3(websiteKey, resp?.data?.uploadUrl, fileList?.[0], resp?.data?.key, setLoading, process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS, fetchMedia);

      } else {
        toast.error(resp.data.message, {
          duration: 2000
        });
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  const fetchMoreMedia = async () => {
    if (!hasMoreMedia || isFetching) return;

    try {
      const lastId = media?.[media.length - 1]?._id || '';
      await fetchMedia(lastId);
    } catch (error) {
      toast.error('Failed to load more media.');
    }
  };




  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;

      // Trigger fetch if the user is within 50px of the bottom
      if (scrollHeight - scrollTop - clientHeight <= 50) {
        fetchMoreMedia();
      }
    }
  };



  useEffect(() => {
    // Initial fetch when the component mounts
    fetchMoreMedia();

    // Debounced scroll event listener
    const debouncedHandleScroll = debounce(handleScroll, 200);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', debouncedHandleScroll);
    }

    // Cleanup event listener when the component is unmounted
    return () => {
      if (container) {
        container.removeEventListener('scroll', debouncedHandleScroll);
      }
    };
  }, [media, hasMoreMedia, isFetching]);

  useEffect(() => {
    if (websiteKey) {
      setMedia([]);
      fetchMedia();
    }
  }, [websiteKey])


  return (
    <div className='w-[90%] absolute top-0 h-[80%] overflow-y-auto z-10 styledScrollable bg-black border-[2px] rounded-lg border-gray-800 p-4'>
      <div className='my-5'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-white text-xl mb-4">Select Preview Image</h2>
          <button className='font-black' onClick={() => setIsMediaModalOpen(false)}>X</button>
        </div>
        <div className='w-full flex flex-row justify-end'>
          <label htmlFor='newImg' className='self-end bg-green-600 px-4 py-2 rounded-lg mt-5 cursor-pointer'>Add New</label>
          <input type="file" name='newImg' id='newImg' onChange={(e: any) => uploadNewFile(e.target.files)} className='hidden' />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {media?.map((media: any) => (

          <div
            key={media._id}
            className="w-[220px] h-[150px] cursor-pointer"
            onClick={() => onSelectImage(media.key)}
          >
            <Image
              src={getURL(media.key)}
              alt=""
              layout="responsive"
              width={1200}
              height={800}
              className="w-full h-full object-cover rounded-md"
            />          </div>
        ))}
      </div>

      {
        (hasMoreMedia && !loading) &&
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
  );
};

export default MediaModal;
