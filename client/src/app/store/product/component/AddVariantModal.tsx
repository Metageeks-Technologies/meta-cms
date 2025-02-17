import React, { useState } from "react";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import axios from "axios";
import { useUserContext } from "@/context/userContext";

interface AddVariantModalProps {
  newVariant: any;
  setNewVariant: (variant: any) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
  handleAddVariant: () => void;
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({
  newVariant,
  setNewVariant,
  setIsAddModalOpen,
  handleAddVariant,
}) => {
  // State to hold image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {websiteKey}=useUserContext();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const uploadedImageKeys: string[] = [];

      // Update previews before uploading
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewUrls]);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
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
              headers: { "Content-Type": file.type },
            });
            uploadedImageKeys.push(key);
          } else {
            toast.error(resp.data.message, { duration: 2000 });
            return;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Image upload failed.");
        }
      }

      setNewVariant((prevState: any) => ({
        ...prevState,
        imageKeys: [...prevState.imageKeys, ...uploadedImageKeys],
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-700 p-6 rounded-lg w-1/2">
        <h3 className="text-2xl font-bold mb-4">Add New Variant</h3>
        <form>
  {/* Variant Pair 1 */}
  <div className="flex gap-4 mb-4">
    <div className="w-1/2">
      <label className="block text-white mb-2">Variant ID</label>
      <input
        type="text"
        placeholder="Variant ID"
        value={newVariant.variantId}
        onChange={(e) => {
          if (e.target.value.length <= 128) {
            setNewVariant({ ...newVariant, variantId: e.target.value });
          }
        }}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>

    <div className="w-1/2">
      <label className="block text-white mb-2">SKU</label>
      <input
        type="text"
        placeholder="SKU"
        value={newVariant.sku}
        onChange={(e) => {
          if (e.target.value.length <= 128) {
            setNewVariant({ ...newVariant, sku: e.target.value });
          }
        }}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>
  </div>

  {/* Variant Pair 2 */}
  <div className="flex gap-4 mb-4">
    <div className="w-1/2">
      <label className="block text-white mb-2">Price</label>
      <input
        type="number"
        placeholder="Price"
        value={newVariant.price || ""}
        onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>

    <div className="w-1/2">
      <label className="block text-white mb-2">Discounted Price</label>
      <input
        type="number"
        placeholder="Discounted Price"
        value={newVariant.discountedPrice || ""}
        onChange={(e) => setNewVariant({ ...newVariant, discountedPrice: Number(e.target.value) })}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>
  </div>

  {/* Variant Pair 3 */}
  <div className="flex gap-4 mb-4">
    <div className="w-1/2">
      <label className="block text-white mb-2">Quantity</label>
      <input
        type="number"
        placeholder="Quantity"
        value={newVariant.quantity || ""}
        onChange={(e) => setNewVariant({ ...newVariant, quantity: Number(e.target.value) })}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>

    <div className="w-1/2">
      <label className="block text-white mb-2">Size</label>
      <input
        type="text"
        placeholder="Size"
        value={newVariant.size}
        onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
    </div>
  </div>

  {/* Variant Color & Image Pair */}
  <div className="flex gap-6 mb-6">
    {/* Color Picker */}
    <div className="flex flex-col items-center w-1/2">
      <label className="block text-white mb-2">Select Color</label>
      <input
        type="color"
        value={newVariant.color}
        onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
      {/* Color Display */}
      <div
        className="mt-2 w-12 h-12 border rounded"
        style={{ backgroundColor: newVariant.color }}
      />
    </div>

    {/* Variant Images */}
    <div className="flex-1">
      <label className="block text-white mb-2">Variant Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full bg-gray-600 p-2 border rounded-md mb-2"
      />
      {/* Image Previews */}
      <div className="flex gap-4 mt-4 flex-wrap overflow-x-auto">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`preview-${index}`}
            className="w-20 h-20 object-cover border rounded-md mb-2"
          />
        ))}
      </div>
    </div>
  </div>

  {/* Save & Cancel buttons */}
  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={handleAddVariant}
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Save
    </button>
    <button
      type="button"
      onClick={() => setIsAddModalOpen(false)}
      className="bg-gray-500 text-white px-4 py-2 rounded-md"
    >
      Cancel
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AddVariantModal;
