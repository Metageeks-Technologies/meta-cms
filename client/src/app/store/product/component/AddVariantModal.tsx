import React from "react";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import axios from "axios";

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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const uploadedImageKeys: string[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const payload = {
          folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PRODUCTCIMAGES,
          fileName: file.name,
          contentType: file.type,
        };

        try {
          const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);
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
            <input
              type="text"
              placeholder="Variant ID"
              value={newVariant.variantId}
              onChange={(e) => setNewVariant({ ...newVariant, variantId: e.target.value })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="SKU"
              value={newVariant.sku}
              onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
          </div>

          {/* Variant Pair 2 */}
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              placeholder="Price"
              value={newVariant.price || ""}
              onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
            <input
              type="number"
              placeholder="Discounted Price"
              value={newVariant.discountedPrice || ""}
              onChange={(e) => setNewVariant({ ...newVariant, discountedPrice: Number(e.target.value) })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
          </div>

          {/* Variant Pair 3 */}
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              placeholder="Quantity"
              value={newVariant.quantity || ""}
              onChange={(e) => setNewVariant({ ...newVariant, quantity: Number(e.target.value) })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Size"
              value={newVariant.size}
              onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
              className="w-1/2 bg-gray-600 p-2 border rounded-md mb-2"
            />
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