import { ProductCardProps } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import React from 'react';
import { useRouter } from 'next/navigation';



const ProductCard: React.FC<ProductCardProps> = ({ product }) => {


    const router = useRouter();

    return (
        <div key={product._id}
            onClick={() => router.push(`/store/product/${product._id}`)}
            className="w-80 my-2 md:my-5 group rounded-lg cursor-pointer group">

            {/* Image Section */}
            <div className="w-full h-[250px] overflow-hidden rounded-t-lg">

                <img
                    src={getURL(product?.variants[0]?.imageKeys[0])}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-t-lg group-hover:scale-110 duration-300"
                />
            </div>

            {/* Content Section */}
            <div className="text-gray-200 flex flex-col gap-1 md:gap-3 mt-2 text-sm md:text-base">
                <h2 className='text-xl md:text-2xl group-hover:underline cursor-pointer'>
                {product.title.length > 20 ? product.title.slice(0, 20) + '...' : product.title}

                </h2>

                <p className="text-white">
                    {product.subDescription.length > 30 ? product.title.slice(0, 30) + '...' : product.title}
                    </p>
                {/* <p>                    {product.category.name}
                </p> */}
                {product.variants && product.variants.length > 0 ? (
                    <div className=" flex flex-row gap-1">
                        <p className="text-lg font-bold text-white">
                            {product.variants[0].discountedPrice.toFixed(2)}
                        </p>
                        {product.variants[0].discountedPrice && product.variants[0].discountedPrice < product.variants[0].price && (
                            <p className="text-sm text-gray-500 line-through">
                                ₹{product.variants[0].price.toFixed(2)}
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-red-500">No variants available.</p>  // Fallback message when no variants are available
                )}
                <div>
                    <button
                        className="w-full mt-4 py-2 px-4 bg-[#1E88E5] text-white text-sm font-semibold rounded-md hover:bg-[#1565C0] transition-colors">
                        View Product
                    </button>
                </div>




                {/* Vendor Section */}
                {/* <div className="mt-4 text-sm text-gray-700">
                    <p><strong>Vendor:</strong> {product.vendor.name}</p>
                    <p><strong>Email:</strong> {product.vendor.email}</p>
                    <p><strong>Phone:</strong> {product.vendor.phoneNo}</p>
                </div> */}
            </div>
        </div>
    );
};

export default ProductCard;
