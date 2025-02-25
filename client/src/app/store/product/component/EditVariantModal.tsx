import React, { useState, useEffect } from "react";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import axios from "axios";
import { getURL } from "@/utils/AWS_Config";
import { useUserContext } from "@/context/userContext";
interface EditVariantModalProps {
  editedVariant: any;
  setEditedVariant: (variant: any) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  handleSaveEdit: () => void;
}

const EditVariantModal: React.FC<EditVariantModalProps> = ({
  editedVariant,
  setEditedVariant,
  setIsEditModalOpen,
  handleSaveEdit,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {websiteKey}=useUserContext();

  useEffect(() => {
    const loadImagePreviews = async () => {
      const previews: string[] = [];

      for (const imageKey of editedVariant.imageKeys) {
        if (imageKey) {
          const imageUrl = getURL(imageKey); 
          previews.push(imageUrl);
        }
      }

      setImagePreviews(previews); // Set the image previews state
    };

    loadImagePreviews();
  }, [editedVariant]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "variantId" || name === "sku") {
      if (value.length > 128) return; // Stop if length exceeds limit
    }
    
    const parsedValue = (name === "quantity" || name === "price" || name === "discountedPrice")
      ? (value === "" ? 0 : parseFloat(value))
      : value;
      
    setEditedVariant((prev: any) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string; // Update preview for this image
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      // Upload image to server
      const payload = {
        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PRODUCTCIMAGES,
        fileName: file.name,
        contentType: file.type,
      };
      try {
        const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload,{websiteKey});
        if (resp.status === 200 || resp.status === 201) {
          const uploadUrl = resp?.data?.uploadUrl;
          const key = resp?.data?.key;
          await axios.put(uploadUrl, file, {
            headers: { 
              "Content-Type": file.type,
              websiteKey: websiteKey
            },
          });
          const newImageKeys = [...editedVariant.imageKeys];
          newImageKeys[index] = key;
          setEditedVariant({ ...editedVariant, imageKeys: newImageKeys });
        } else {
          toast.error(resp.data.message, { duration: 2000 });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Image upload failed.");
      }
    }
  };

  const handleAddImage = () => {
    setEditedVariant({ ...editedVariant, imageKeys: [...editedVariant.imageKeys, ''] });
    setImagePreviews([...imagePreviews, '']); // Add placeholder for the new image preview
  };

  const handleRemoveImage = (index: number) => {
    const newImageKeys = editedVariant.imageKeys.filter((_: any, i: number) => i !== index);
    const newPreviews = imagePreviews.filter((_: any, i: number) => i !== index);
    setEditedVariant({ ...editedVariant, imageKeys: newImageKeys });
    setImagePreviews(newPreviews); // Remove preview for the deleted image
  };

  // Determine if scrollbar should be shown (more than 3 images)
  const shouldShowScrollbar = editedVariant.imageKeys.length > 3;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={() => setIsEditModalOpen(false)}>
      <div className="bg-gray-700 p-4 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-3">Edit Variant</h3>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {/* Two columns layout for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Id</label>
                <input
                  type="text"
                  name="variantId"
                  value={editedVariant.variantId || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                  
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={editedVariant.sku || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editedVariant.price || 0}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Color</label>
                <input
                  type="color"
                  name="color"
                  value={editedVariant.color || '#000000'}
                  onChange={handleInputChange}
                  className="w-full h-8 rounded-md bg-[#1A1A1A] text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Discounted Price</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={editedVariant.discountedPrice || 0}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedVariant.quantity || 0}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={editedVariant.size || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div>
            <label className="block text-xs font-semibold mb-1">Images</label>
            <div className={`${shouldShowScrollbar ? 'max-h-48 overflow-y-auto styledScrollable pr-1' : ''}`}>
              {editedVariant.imageKeys.map((image: string, index: number) => (
                <div key={index} className="flex space-x-2 mb-2 items-center">
                  {/* Image preview */}
                  {imagePreviews[index] && (
                    <img
                      src={imagePreviews[index]}
                      alt={`Image Preview ${index}`}
                      className="w-16 h-16 object-cover"
                    />
                  )}

                  {/* Show file input only for images that need to be uploaded */}
                  {!imagePreviews[index] && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="w-full bg-gray-600 p-1.5 border rounded-md text-sm"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Button to add a new image */}
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-md mt-2 text-sm"
            >
              Add Image
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 text-white px-3 py-1.5 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVariantModal;