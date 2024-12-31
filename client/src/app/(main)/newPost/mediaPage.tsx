import React from 'react';
import { dummyMedia } from '@/constant/post'; // Assuming dummyMedia is an array of media objects

interface MediaPageProps {
  onSelectImage: (imageUrl: string) => void;
}

const MediaPage: React.FC<MediaPageProps> = ({ onSelectImage }) => {
  return (
    <div>
      <h2 className="text-white text-xl mb-4">Select Preview Image</h2>
      <div className="grid grid-cols-3 gap-4">
        {dummyMedia.map((media) => (
          <div
            key={media.id}
            className="cursor-pointer"
            onClick={() => onSelectImage(media.url)} 
          >
            {media.type === 'image' ? (
              <img src={media.url} alt="" className="w-full h-36 object-cover rounded-md" />
            ) : (
              <video src={media.url} controls className="w-full h-36 object-cover rounded-md"></video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
