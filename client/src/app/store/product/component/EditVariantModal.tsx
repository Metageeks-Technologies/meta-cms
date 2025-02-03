import React from "react";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";
import axios from "axios";

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = (name === "quantity" || name === "price" || name === "discountedPrice")
      ? (value === "" ? 0 : parseFloat(value))
      : value;
    setEditedVariant((prev: any) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
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
  };

  const handleRemoveImage = (index: number) => {
    const newImageKeys = editedVariant.imageKeys.filter((_: any, i: number) => i !== index);
    setEditedVariant({ ...editedVariant, imageKeys: newImageKeys });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-700 p-6 rounded-lg w-1/2">
        <h3 className="text-2xl font-bold mb-4">Edit Variant</h3>
        <form>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Id</label>
              <input
                type="text"
                name="id"
                value={editedVariant.variantId}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
                disabled
              />
            </div>
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">SKU</label>
              <input
                type="text"
                name="sku"
                value={editedVariant.sku}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Price</label>
              <input
                type="text"
                name="price"
                value={editedVariant.price}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold">Discounted Price</label>
              <input
                type="text"
                name="discountedPrice"
                value={editedVariant.discountedPrice}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Quantity & Size */}
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={editedVariant.quantity}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold">Size</label>
              <input
                type="text"
                name="size"
                value={editedVariant.size}
                onChange={handleInputChange}
                className="w-full bg-gray-600 p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Color</label>
            <input
              type="color"
              name="color"
              value={editedVariant.color}
              onChange={handleInputChange}
              className="w-full  rounded-md bg-[#1A1A1A] text-white focus:outline-none cursor-pointer"
              />
 {/* <input
    type="color"
    value={variant.color}
    onChange={(e) => {
      const hexColor = e.target.value;
      if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
        handleVariantChange(index, 'color', hexColor);
      } else {
        // Handle invalid color input if needed
        console.error("Invalid hex color");
      }
    }}
    className="w-full  rounded-md bg-[#1A1A1A] text-white focus:outline-none cursor-pointer"
  /> */}


          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Images</label>
            {editedVariant.imageKeys.map((image: string, index: number) => (
              <div key={index} className="flex space-x-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  className="w-full bg-gray-600 p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Image
            </button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
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

export default EditVariantModal;