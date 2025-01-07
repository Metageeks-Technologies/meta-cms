import React, { useEffect, useState } from 'react';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { uploadToS3 } from '@/utils/helperFunction';
import { useUserContext } from '@/context/userContext';
import { usePostContext } from '@/context/postContext';
import { getURL } from '@/utils/AWS_Config';

interface MediaPageProps {
  onSelectImage: (imageUrl: string) => void;
  setIsMediaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaModal: React.FC<MediaPageProps> = ({ onSelectImage, setIsMediaModalOpen }) => {

  const { setLoading } = useUserContext();
  const { media, fetchMedia } = usePostContext()


  const uploadNewFile = async (fileList: FileList | null) => {
    try {
      setLoading(true);
      // console.log(fileList?.[0]);
      const payload = {
        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS,
        fileName: fileList?.[0].name,
        contentType: fileList?.[0].type
      }
      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);

      // console.log(resp, "generate upload url")

      if (resp.status === 200 || resp.status === 201) {
        uploadToS3(resp?.data?.uploadUrl, fileList?.[0], resp?.data?.key, setLoading, process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS, fetchMedia);
        
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

  useEffect(() => {
    fetchMedia();
  }, []);


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
            <img src={getURL(media.key)} alt="" className="w-full h-full object-cover rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaModal;
