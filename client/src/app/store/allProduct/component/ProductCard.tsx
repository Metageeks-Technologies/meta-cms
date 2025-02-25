import { ProductCardProps } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Tag } from 'lucide-react';
import Image from 'next/image';


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();

    const calculateDiscount = () => {
        if (product.variants?.[0]) {
            const originalPrice = product.variants[0].price;
            const discountedPrice = product.variants[0].discountedPrice;

            // If the discounted price is 0, return 0% discount
            if (discountedPrice === 0) {
                return 0;
            }

            const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };


    return (
        <div
            className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 w-72 cursor-pointer"
            onClick={() => router.push(`/store/product/${product._id}`)}
        >
            {/* Discount Badge */}
            {calculateDiscount() > 0 && (
                <div className="absolute top-2 right-2 z-[5]  bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {calculateDiscount()}% OFF
                </div>
            )}

            {/* Image Container */}
            <div className="relative w-72 h-72 overflow-hidden bg-white flex items-center justify-center">
                <Image
                    src={getURL(product?.variants[0]?.imageKeys[0])}
                    alt={product.title}
                    layout="intrinsic"
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-300"
                />


            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Category */}
                {product.category?.name && (
                    <p className="text-blue-400 text-sm mb-1">
                        {product.category.name}
                    </p>
                )}

                {/* Title */}
                <h2 className="text-base font-medium text-gray-100 mb-1 line-clamp-1">
                    {product.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.subDescription}
                </p>

                {/* Price Section */}
                {product.variants && product.variants.length > 0 ? (
                    <div className="flex items-center gap-2 mb-3">
                        {product.variants[0].discountedPrice > 0 ? (
                            <>
                                <span className="text-lg font-bold text-white">
                                    ₹{product.variants[0].discountedPrice.toFixed(2)}
                                </span>
                                {product.variants[0].discountedPrice < product.variants[0].price && (
                                    <span className="text-gray-500 text-sm line-through">
                                        ₹{product.variants[0].price.toFixed(2)}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-lg font-bold text-white">
                                ₹{product.variants[0].price.toFixed(2)}
                            </span>
                        )}
                    </div>

                ) : (
                    <p className="text-red-500 text-sm mb-3">No variants available</p>
                )}

                {/* View Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-300">
                    View Product
                </button>
            </div>
        </div>
    );
};

export default ProductCard;