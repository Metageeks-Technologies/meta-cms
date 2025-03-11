'use client';
import React, { useState, useEffect } from "react";
import axiosCall from "@/utils/ApiCall";
import { getURL } from "@/utils/AWS_Config";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import EditVariantModal from "../component/EditVariantModal";
import AddVariantModal from "../component/AddVariantModal";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import {
  Dialog
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft,TriangleAlert,Trash2 } from "lucide-react";


const ProductCard: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editedVariant, setEditedVariant] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);


  const { user, loading, setLoading, websiteKey } = useUserContext();

  const [newVariant, setNewVariant] = useState<any>({
    variantId: "",
    sku: "",
    price: 0,
    discountedPrice: 0,
    quantity: 0,
    size: "",
    color: "",
    imageKeys: [],
  });

  const router = useRouter();


  const handleSaveEdit = async () => {
    try {
      const response = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}/${editedVariant.variantId}`, editedVariant, { websiteKey });

      const updatedProduct = { ...product };
      updatedProduct.variants = updatedProduct.variants.map((variant: any) =>
        variant.variantId === editedVariant.variantId ? editedVariant : variant
      );
      setProduct(updatedProduct);
      setSelectedVariant(editedVariant);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error saving variant edit:", error);
    }
  };



  const handleAddVariant = async () => {
    if (!newVariant.variantId.trim()) {
      toast.error('Variant ID is required', {
        duration: 2000,
      });
      return; // Prevent further execution if variantId is missing
    }

    // Check if sku is empty
    if (!newVariant.sku.trim()) {
      toast.error('SKU is required', {
        duration: 2000,
      });
      return; // Prevent further execution if sku is missing
    }



    const existingVariantId = product.variants.find((variant: any) => variant.variantId === newVariant.variantId);
    if (existingVariantId) {
      toast.error('Variant ID already exists', {
        duration: 2000,
      });
      return;
    }

    // Check if the SKU already exists in the current product's variants
    const existingSku = product.variants.find((variant: any) => variant.sku === newVariant.sku);
    if (existingSku) {
      toast.error('SKU already exists', {
        duration: 2000,
      });
      return;
    }

    if (!newVariant.price && (!newVariant.color || !newVariant.size)) {
      toast.error("Price, Color, and Size are required!", { duration: 2000 });
      return; // Prevent moving forward
    }


    try {
      const response = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}`, newVariant, { websiteKey });
      setProduct((prev: any) => ({
        ...prev,
        variants: [...prev.variants, response.data],
      }));
      fetchProductData();
      setIsAddModalOpen(false); // Close the modal after adding
      setNewVariant({
        variantId: '',
        sku: '',
        price: 0,
        discountedPrice: 0,
        quantity: 0,
        size: '',
        color: '#000000',
        imageKeys: [],
      });
    } catch (error) {
      console.error("Error adding new variant:", error);
    }
  };





  const params = useParams();
  const id = params.id;

  const fetchProductData = async () => {
    try {
      const response = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, undefined, { websiteKey });
      const filteredVariants = response.data.variants.filter((variant: any) => !variant.isDeleted);
      setProduct({
        ...response.data,
        variants: filteredVariants,
      });
      const firstVariant = filteredVariants[0];
      setSelectedVariant(firstVariant);
      setSelectedImage(firstVariant?.imageKeys[0] || "");
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleDelete = async (id: any) => {
    setLoading(true);
    try {
      const response = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/products/delete/${product._id}`, undefined, { websiteKey });
      if (response.status === 200 || response.status === 204) {
        toast.success(response?.data?.message, { duration: 2000 });
        router.push(`/store/allProduct`);
      } else {
        toast.error(response?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error deleting product.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: any) => {
    if (!id) {
      toast.error("Product ID not found.");
      return;
    }

    if (product._id) {
      router.push(`/store/editProduct/${product._id}`);
    } else {
      toast.error("Product ID not found.");
    }
  };


  const handleRecover = async (id: any) => {
    setLoading(true);
    try {
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/recover/${product._id}`, undefined, { websiteKey });
      if (response.status === 200 || response.status === 204) {
        toast.success(response?.data?.message, { duration: 2000 });
        router.push(`/store/allProduct`);
      } else {
        toast.error(response?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error approve product.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: any) => {
    setLoading(true);
    try {
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/approve/${product._id}`, undefined, { websiteKey });
      if (response.status === 200 || response.status === 204) {
        toast.success(response?.data?.message, { duration: 2000 });
        router.push(`/store/allProduct`);
      } else {
        toast.error(response?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error approve product.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  const handleRejected = async (id: any) => {
    setLoading(true);
    try {
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/reject/${product._id}`, undefined, { websiteKey });
      if (response.status === 200 || response.status === 204) {
        toast.success(response?.data?.message, { duration: 2000 });
        router.push(`/store/allProduct`);
      } else {
        toast.error(response?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error rejected product.', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }




  useEffect(() => {
    if (websiteKey) {
      fetchProductData();
    }
  }, [websiteKey, id]);

  const fetchVariantData = (variantId: string) => {
    const variant = product?.variants?.find((v: any) => v.variantId === variantId);
    setEditedVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const updatedVariants = product?.variants.filter((variant: any) => variant.variantId !== variantId);

      // Check if there is only one variant left
      if (updatedVariants.length === 0) {
        toast.error("At least one variant must remain.");
        return; // Prevent further deletion
      }
      const response = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}/${variantId}`, undefined, { websiteKey });
      if (response.status === 200) {
        const updatedVariants = product?.variants.filter((variant: any) => variant.variantId !== variantId);
        setProduct((prev: any) => ({
          ...prev,
          variants: updatedVariants,
        }));
        if (selectedVariant.variantId === variantId) {
          const nextVariant = updatedVariants[0] || null;
          setSelectedVariant(nextVariant);
          setSelectedImage(nextVariant?.imageKeys[0] || "");

        }
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant.");
    }
  };

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.imageKeys[0] || "");
  };

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className='mt-10 text-3xl '>No products found.....</p>
      </div>
    );
  }


  const { title, subDescription, description, variants, status, isDeleted } = product;
  const stockStatus = selectedVariant?.quantity > 0 ? "In Stock" : "Out of Stock";

  return (
    <div className="text-gray-200 p-3 sm:p-8">
      <div className="my-3">
        <button
          onClick={() => router.push('/store/allProduct')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          <span>Back to Products</span>
        </button>
      </div>

          <div className="flex flex-col lg:flex-row gap-4 ">
              {/* Image Section */}
              <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:max-w-lg bg-black rounded-lg shadow-sm p-4">
                  {/* Product Image */}
                  <div className="relative w-[500px] h-[500px] bg-white rounded-lg border border-gray-300 overflow-hidden ml-10 flex items-center justify-center">
                      <Image
                          alt={product?.title || 'Product'}
                          src={getURL(selectedImage)}
                          layout="responsive"
                          width={1200}
                          height={800}
                          className="w-full h-full object-cover"
                      />
                  </div>

          {/* Thumbnails Section */}
          {selectedVariant?.imageKeys?.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {selectedVariant.imageKeys.map(
                (image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`w-14 h-14 bg-white rounded-lg overflow-hidden border-2 transition-all 
                    ${selectedImage === image ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                  >
                    <img
                      src={getURL(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-6  ml-20">
          <div>
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium 
                ${stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {stockStatus}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-400">{subDescription}</p>
          </div>

          {/* Price Section */}
          <div className="mt-4">
            {selectedVariant?.discountedPrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white">
                  ₹{selectedVariant.discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{selectedVariant.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-white">
                ₹{selectedVariant?.price.toFixed(2)}
              </span>
            )}
          </div>

                  {/* Variant Selection */}
                  {variants && variants.length > 0 && (
                      <div className="mt-8">
                          <h4 className="font-semibold text-xl mb-4">
                              Product Variants
                          </h4>
                          <div className="flex flex-wrap gap-3">
                              {variants
                                  .filter((variant: any) => !variant.isDeleted)
                                  .map((variant: any, index: number) => (
                                      <button
                                          key={variant.variantId || index}
                                          onClick={() =>
                                              handleVariantChange(variant)
                                          }
                                          className={`relative rounded-lg transition-all ${
                                              selectedVariant?.variantId ===
                                              variant.variantId
                                                  ? 'ring-2 ring-blue-500'
                                                  : ''
                                          }`}
                                      >
                                          {variant.color ? (
                                              <span
                                                  style={{
                                                      backgroundColor:
                                                          variant.color,
                                                  }}
                                                  className="block w-12 h-12 rounded-lg border border-gray-600"
                                              />
                                          ) : variant.size ? (
                                              <span className="flex w-12 h-12 rounded-lg border  border-gray-600 items-center justify-center ">
                                                  <span>{variant.size}</span>
                                              </span>
                                          ) : null}
                                      </button>
                                  ))}
                          </div>
                      </div>
                  )}

          {/* Variant Details */}
          {selectedVariant && (
            <div className="mt-8 p-6 bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-xl mb-4">
                Variant Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Variant ID:{' '}
                    <span className="text-white">
                      {selectedVariant.variantId}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    SKU:{' '}
                    <span className="text-white">
                      {selectedVariant.sku}
                    </span>
                  </p>
                  {selectedVariant.size && (
                    <p className="text-gray-400">
                      Size:{' '}
                      <span className="text-white">
                        {selectedVariant.size}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-400">
                    MRP Price:{' '}
                    <span className="text-white ">
                      ₹{selectedVariant.price.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Quantity:{' '}
                    <span className="text-white">
                      {selectedVariant.quantity}
                    </span>
                  </p>
                  {selectedVariant.color && (
                    <div className="flex items-center gap-2 text-gray-400">
                      Color:
                      <span
                        style={{
                          backgroundColor:
                            selectedVariant.color,
                        }}
                        className="w-6 h-6 rounded-full border border-gray-600"
                      />
                    </div>
                  )}
                  <p className="text-gray-400">
                    Discounted Price:{' '}
                    <span className="text-white">
                      ₹
                      {selectedVariant.discountedPrice > 0
                        ? selectedVariant.discountedPrice.toFixed(
                          2,
                        )
                        : selectedVariant.price.toFixed(
                          2,
                        )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() =>
                    fetchVariantData(
                      selectedVariant.variantId,
                    )
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Edit Variant
                </button>
                <button
                  onClick={() =>
                    handleDeleteVariant(
                      selectedVariant.variantId,
                    )
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 transition-colors"
                >
                  Delete Variant
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className=" px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-900 transition-colors"
                >
                  Add Variant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 p-6 bg-gray-800 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Description</h2>
        <div
          className="prose prose-invert max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

          {/* Action Buttons Section */}
          <div className="mt-8 flex flex-wrap gap-4">
              {!product.isDeleted && (
                  <AlertDialog>
                      <AlertDialogTrigger className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-gray-900 border-gray-800">
                          <AlertDialogHeader>
                              <AlertDialogTitle></AlertDialogTitle>
                              <AlertDialogDescription>
                                  <div className="flex flex-col items-center gap-4">
                                      <TriangleAlert className="w-16 h-16 text-red-500 " />
                                      <h2 className="text-xl font-semibold text-gray-100">
                                          Delete Product
                                      </h2>
                                      <p className="text-gray-400 text-center">
                                          Are you sure you want to delete this
                                          Product? This action cannot be undone.
                                      </p>
                                  </div>
                              </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">
                                  Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-red-500 text-white hover:bg-red-600"
                              >
                                  Delete
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              )}

        {(user?.id === product?.authorId ||
          user.role === 'superadmin' ||
          user.role === 'admin') && (
            <Button
              onClick={handleEdit}
              className="bg-blue-500 text-white hover:bg-blue-900"
            >
              Edit Product
            </Button>
          )}

              {/* Only admin, superadmin, or moderator can see Publish & Reject buttons */}
              {(user.role === 'superadmin' ||
                  user.role === 'admin' ||
                  user.role === 'moderator') &&
                  (product.status === 'draft' ||
                      product.status === 'awaiting approval') && (
                      <div className="flex gap-4">
                          <Button
                              onClick={handleApprove}
                              className="bg-green-700 text-white hover:bg-green-500/30"
                          >
                              Publish Product
                          </Button>
                          <Button
                              onClick={handleRejected}
                              className="bg-red-700 text-white hover:bg-red-500/30"
                          >
                              Reject Product
                          </Button>
                      </div>
                  )}

              {/* Only admin, superadmin, or moderator can see Recover button */}
              {(user.role === 'superadmin' ||
                  user.role === 'admin' ||
                  user.role === 'moderator') &&
                  product.isDeleted && (
                      <Button
                          onClick={handleRecover}
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                          Recover Product
                      </Button>
                  )}
          </div>

      {/* Modals */}
      {isEditModalOpen && editedVariant && (
        <EditVariantModal
          editedVariant={editedVariant}
          setEditedVariant={setEditedVariant}
          setIsEditModalOpen={setIsEditModalOpen}
          handleSaveEdit={handleSaveEdit}
        />
      )}

      {isAddModalOpen && (
        <AddVariantModal
          newVariant={newVariant}
          setNewVariant={setNewVariant}
          setIsAddModalOpen={setIsAddModalOpen}
          handleAddVariant={handleAddVariant}
        />
      )}
    </div>
  );
};

export default ProductCard;