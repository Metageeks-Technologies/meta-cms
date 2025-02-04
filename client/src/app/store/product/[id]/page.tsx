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
import { StoreRole } from "@/constant/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


const ProductCard: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editedVariant, setEditedVariant] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const { user } = useUserContext();

  const { loading, setLoading } = useUserContext();

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
      const response = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}/${editedVariant.variantId}`, editedVariant);
      // console.log(response)
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


    try {
      const response = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}`, newVariant);
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
  // console.log(id)

  const fetchProductData = async () => {
    try {
      const response = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);
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
      const response = await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/products/delete/${product._id}`);
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
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/recover/${product._id}`);
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
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/approve/${product._id}`);
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
      const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/products/reject/${product._id}`);
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
    fetchProductData();
  }, [id]);

  const fetchVariantData = (variantId: string) => {
    const variant = product?.variants?.find((v: any) => v.variantId === variantId);
    setEditedVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const response = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/products/variant/${id}/${variantId}`);
      if (response.status === 200) {
        const updatedVariants = product?.variants.filter((variant: any) => variant.variantId !== variantId);
        setProduct((prev: any) => ({
          ...prev,
          variants: updatedVariants,
        }));
        if (selectedVariant.variantId === variantId) {
          setSelectedVariant(null);
          setSelectedImage("");
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
    <div className="text-gray-200 p-3 sm:p-8"> <div className='my-3 flex justify-start'>
      <ArrowLeft className='w-5 sm:w-8 h-4 sm:h-8 cursor-pointer' onClick={() => router.push('/store/allProduct')} />

    </div>
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Image Section */}
        <div className="flex flex-col w-full sm:w-1/2 pr-4">
          <div className="w-full overflow-hidden rounded-lg relative">
            <img alt="Product" loading="lazy" width="400" height="600"
              src={getURL(selectedImage)}
              className="w-[95%] h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 space-x-2">
            {selectedVariant?.imageKeys.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`w-16 h-16 border rounded-md ${selectedImage === image ? "border-blue-500" : "border-gray-300"}`}
              >
                <img
                  src={getURL(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full sm:w-1/2">
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stockStatus === "In Stock" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {stockStatus}
              </span>
            </div>

            <h4 className="text-2xl font-bold mt-2">{title}</h4>
            <p className="text-sm text-gray-500 mt-1">{subDescription}</p>

            <div className="text-xl font-bold mt-2">
              {selectedVariant?.discountedPrice ? (
                <>
                  <span className="line-through text-zinc-700">
                    ₹{selectedVariant?.price}
                  </span>{" "}
                  <span className="text-blue-600">₹{selectedVariant?.discountedPrice}</span>
                </>
              ) : (
                <span className="text-blue-600">₹{selectedVariant?.price}</span>
              )}
            </div>


            <hr className="my-4 border-gray-800 border-t-2" />

            {/* <div>
              <h6 className="font-semibold mb-2">Total Quantity:</h6>
              <span className="border rounded px-4 py-2">{selectedVariant?.quantity}</span>
            </div> */}

            {/* <hr className="my-4 border-gray-800 border-t-2" /> */}

            {/* Variant Selection */}
            {variants && variants.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold text-xl">Product Variants</h4>
                <div className="flex space-x-4 mt-4">
                  {variants
                    .filter((variant: any) => !variant.isDeleted)
                    .map((variant: any, index: number) => (
                      <button
                        key={variant.variantId || index}
                        onClick={() => handleVariantChange(variant)}
                        className={`${selectedVariant?.variantId === variant.variantId
                          ? "scale-100 border-2 border-white shadow-md"
                          : "scale-100"
                          } transition-all duration-200 ease-in-out transform p-2 rounded-md`}
                      >
                        {variant.color ? (
                          <span
                            style={{ backgroundColor: variant.color }}
                            className={`inline-block w-8 h-8 rounded-full border-2 ${selectedVariant?.variantId === variant.variantId
                              ? "border-blue-600"
                              : "border-yellow-400"
                              }`}
                          ></span>
                        ) : null}

                        {variant.size && !variant.color ? (
                          <span className="border p-2 rounded-md">{variant.size}</span>
                        ) : null}
                      </button>
                    ))}
                </div>
              </div>
            )}


            {/* Variant Details */}
            {selectedVariant && (
              <div className="mt-6">
                <ul className="space-y-2 mt-4 grid grid-cols-2 gap-x-4">
                  <li><strong>Variant ID:</strong> {selectedVariant.variantId}</li>
                  <li><strong>SKU:</strong> {selectedVariant.sku}</li>
                  {selectedVariant.size && <li><strong>Size:</strong> {selectedVariant.size}</li>}
                  {selectedVariant.color && (
                    <li className="flex items-center">
                      <strong className="mr-2">Color:</strong>
                      <span
                        style={{ backgroundColor: selectedVariant.color }}
                        className="inline-block w-6 h-6 rounded-full border-yellow-400 mr-2"
                      ></span>
                    </li>
                  )}

                  <li><strong>Price:</strong> ₹{selectedVariant.price}</li>
                  {selectedVariant?.discountedPrice && (
                    <li><strong>Discounted Price:</strong> ₹{selectedVariant.discountedPrice}</li>
                  )}
                  <li><strong>Quantity:</strong> {selectedVariant.quantity}</li>
                </ul>

                {/* Edit Variant Button */}
                <button
                  onClick={() => fetchVariantData(selectedVariant.variantId)}
                  className="mt-4 text-white bg-blue-600 px-4 py-2 rounded-md "
                >
                  Edit
                </button>

                {/* Delete Variant Button */}
                <button
                  onClick={() => handleDeleteVariant(selectedVariant.variantId)}
                  className="mt-4 text-white bg-red-600 px-4 py-2 rounded-md ml-5"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 text-white bg-green-600 px-4 py-2 rounded-md"
        >
          Add Variant
        </button>
      </div>

      {/* Product Description */}
      <div className="w-full mt-9 border-gray-800 border rounded-xl px-4 py-4">
        <span className="font-semibold underline text-purple-500 mb-6">Description</span>
        <div className="tinymce-content" id='postContent' dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>

      {/* Product status  buttons */}

      <div className="w-full   mt-9 px-4 py-4">

        {
          ((user?.storeRole === StoreRole.SUPERADMIN || user?.storeRole === StoreRole.STOREMODERATOR) && product?.status === "awaiting approval") &&
          <div className='w-full flex flex-row gap-3 mt-5'>
            <button onClick={handleRejected} className='w-full bg-red-200 border-[2px] border-red-600 text-red-600 font-bold p-2 rounded-lg text-base'>Reject</button>
            <button onClick={handleApprove} className='w-full bg-green-200 border-[2px] border-green-600 text-green-600 font-bold p-2 rounded-lg text-base'>Approve</button>
          </div>
        }


        <div className='flex justify-between mt-4'>
          {/* Existing Delete product button */}
          {!product.isDeleted && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='bg-red-500 max-w-min text-white px-6 py-3 text-base rounded-lg font-bold hover:bg-red-700'>Delete Product</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black text-white border-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center my-5 text-xl">Are you absolutely sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-white bg-black">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="text-white bg-red-500 hover:bg-red-700">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {
            product.isDeleted && user.role === StoreRole.SUPERADMIN &&

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='bg-green-500 max-w-min text-white px-6  text-base rounded-lg font-bold hover:bg-green-700'>Recover Product</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black text-white border-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center my-5 text-xl">Are you absolutely sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-white bg-black">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRecover} className="text-white bg-green-500 hover:bg-green-700">Recover</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }


          {/* Existing Edit Post button */}
          {(user?.id === product?.authorId || user.role === StoreRole.SUPERADMIN) && (
            <button
              onClick={handleEdit}
              className='bg-green-200 border-[2px] border-green-600 text-green-600 font-bold px-6 rounded-lg text-base'
            >
              Edit Product
            </button>
          )}
        </div>


        {
          product.status === "draft" &&
          <div className='w-full flex flex-row gap-3 mt-5'>
            <button onClick={handleApprove} className='w-full bg-green-200 border-[2px] border-green-600 text-green-600 font-bold p-2 rounded-lg text-base'>Publish Product</button>
          </div>
        }
      </div>

      {/* Edit Variant Modal */}
      {isEditModalOpen && editedVariant && (
        <EditVariantModal
          editedVariant={editedVariant}
          setEditedVariant={setEditedVariant}
          setIsEditModalOpen={setIsEditModalOpen}
          handleSaveEdit={handleSaveEdit}
        />
      )}

      {/* Add Variant Modal */}
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