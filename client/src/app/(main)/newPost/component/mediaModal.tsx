import React, { useState } from 'react';
import { dummyMedia } from '@/constant/post'; // Assuming dummyMedia is an array of media objects
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { uploadToS3 } from '@/utils/helperFunction';
import { useUserContext } from '@/context/userContext';

interface MediaPageProps {
  onSelectImage: (imageUrl: string) => void;
  setIsMediaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaModal: React.FC<MediaPageProps> = ({ onSelectImage, setIsMediaModalOpen }) => {

  const {setLoading} = useUserContext();


  const uploadNewFile = async (fileList: FileList | null) => {
    try {
      setLoading(true);
      // console.log(fileList?.[0]);
      const payload = {
        folderName: "users",
        fileName: fileList?.[0].name,
        contentType: fileList?.[0].type
      }
      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);

      console.log(resp, "generate upload url")

      if(resp.status === 200 || resp.status === 201){

        console.log('response true');
        uploadToS3(resp?.data?.uploadUrl, fileList?.[0]);
      }else{
        toast.error(resp.data.message , {
          duration: 2000
        })
        setLoading(false);
      }



    } catch (error) {
      setLoading(false);
      console.log(error);

    }
  }


  return (
    <div className='w-[90%] absolute top-0 h-[80%] overflow-y-auto z-10 styledScrollable bg-black border-[2px] rounded-lg border-gray-800 p-4'>
      <div className='my-5'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-white text-xl mb-4">Select Preview Image</h2>
          <button className='font-black' onClick={() => setIsMediaModalOpen(false)}>X</button>
        </div>
        <div className='w-full flex flex-row justify-end'>
          <label htmlFor='newImg' className='self-end bg-green-600 px-4 py-2 rounded-lg mt-5 cursor-pointer'>Add New</label>
          <input type="file" name='newImg' id='newImg' onChange={(e: React.ChangeEvent<HTMLInputElement>) => uploadNewFile(e.target.files)} className='hidden' />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {dummyMedia.map((media) => (

          <div
            key={media.id}
            className="cursor-pointer"
            onClick={() => onSelectImage(media.url)}
          >
            {media.type === 'image' ? (
              <img src={media.url} alt="" className="w-full h- object-cover rounded-md" />
            ) : (
              <video src={media.url} controls className="w-full h-36 object-cover rounded-md"></video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaModal;
