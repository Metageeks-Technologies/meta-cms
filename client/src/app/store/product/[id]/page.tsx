'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosCall from "@/utils/ApiCall";
import { getURL } from "@/utils/AWS_Config";
import { useParams, useRouter } from "next/navigation";

const ProductCard: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
      const params = useParams();
      const id = params.id;
  

  useEffect(() => {
    // Function to fetch product data
    const fetchProductData = async () => {
      try {
        const response = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);

        setProduct(response.data);
        const firstVariant = response.data.variants[0];
        setSelectedVariant(firstVariant);
        setSelectedImage(firstVariant.imageKeys[0] || ""); // Set the first image by default
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  if (!product) {
    return (
      <div className="text-center py-12">
        <span className="text-xl font-semibold text-red-500">Product not found!</span>
      </div>
    );
  }

  const { title, subDescription, description, variants, status } = product;

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.imageKeys[0] || "");
  };

  // Determine stock status based on quantity
  const stockStatus = selectedVariant?.quantity > 0 ? "In Stock" : "Out of Stock";

  return (
    <div className="text-gray-200 p-3 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Image Section */}
        <div className="flex flex-col w-full sm:w-1/2 pr-4">
          <div className="w-full overflow-hidden rounded-lg relative">
            <img
              alt="Product"
              loading="lazy"
              width="400"
              height="600"
              // src={selectedImage}
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
              <span className="line-through text-red-500">
                ₹{selectedVariant?.price}
              </span>{" "}
              <span className="text-blue-600">₹{selectedVariant?.discountedPrice}</span>
            </div>

            <hr className="my-4 border-gray-800 border-t-2" />

            <div>
              <h6 className="font-semibold mb-2">Total Quantity:</h6>
              <span className="border rounded px-4 py-2">{selectedVariant?.quantity}</span>
            </div>

            <hr className="my-4 border-gray-800 border-t-2" />
             {/* Variant Selection */}
      <div className="mt-8">
        <h4 className="font-semibold text-xl">Variants:</h4>
        <div className="flex space-x-4 mt-4">
          {variants.map((variant: any) => (
            <button
              key={variant.variantId}
              onClick={() => handleVariantChange(variant)}
              className={`border px-4 py-2 rounded-md ${selectedVariant?.variantId === variant.variantId ? "bg-blue-500 text-white" : "bg-blue-800"}`}
            >
              {variant.size ? `${variant.variantId}` : ` ${variant.variantId}`}
            </button>
          ))}
        </div>
      </div>

            <p className="text-sm text-white-500 mt-4">Delivered in 5-7 days</p>
            <a href="/" className="text-blue-600 text-sm">
              Why the longer time for delivery?
            </a>
          </div>
        </div>
      </div>

     

      {/* Product Description */}
      <div className="w-full mt-9 border-gray-800 border rounded-xl px-4 py-4">

        <span className="font-semibold underline text-purple-500 mb-6">Description</span>
        <div className="tinymce-content" id='postContent' dangerouslySetInnerHTML={{ __html:description }}></div>
      </div>
    </div>
  );
};

export default ProductCard;
