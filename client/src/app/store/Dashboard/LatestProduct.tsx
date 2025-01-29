import React from "react";

import { products } from "@/constant/dummyStoreData";





const LatestProducts: React.FC = () => {
  return (
    <div>      <h3 className="text-lg font-bold mb-6">Latest Products</h3>
      <ul className="space-y-6">
        {products.map((product, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-lg mr-4 border border-gray-700"
              />
              <div>
                <div className="font-semibold text-sm">{product.name}</div>
                <div className="text-gray-400 text-xs">Updated {product.updatedDate}</div>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-white"
              aria-label={`More options for ${product.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="block text-right text-gray-400 text-sm mt-6 hover:text-white"
      >
        View all →
      </a>
    </div>
  );
};

export default LatestProducts;