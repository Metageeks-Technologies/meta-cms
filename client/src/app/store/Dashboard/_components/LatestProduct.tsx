import React from "react";

import { products } from "@/constant/dummyStoreData";
import { getURL } from "@/utils/AWS_Config";





const LatestProducts = ({data}: any) => {

  if(!data){
    return <div></div>
  }

  return (
    <div>      <h3 className="text-lg font-bold mb-6">Latest Products</h3>
      <ul className="space-y-6">
        {data.map((product: any, index: number) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={getURL(product?.variants[0].imageKeys[0])}
                alt={product.name}
                className="w-16 h-16 rounded-lg mr-4 border border-gray-700"
              />
              <div>
                <div className="font-semibold text-sm">{product.title.length > 30 ? `${product.title.slice(0, 30)}...` : product.title}</div>
                <div className="text-gray-400 text-xs">{product.subDescription.length > 80 ? `${product.subDescription.slice(0, 80)}...` : product.subDescription}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestProducts;