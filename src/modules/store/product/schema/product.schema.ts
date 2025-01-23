import { validate } from "class-validator";
import mongoose from "mongoose";


export enum ProductStatusEnum {
    DRAFT = 'draft',
    AWAITING_APPROVAL = 'awaiting approval',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
}

export interface IProductVariant {
    variantId: string;
    sku: string;
    price: number;
    discountedPrice?: number;
    quantity: number;
    color?: string;
    //   attributes?: Record<string, string>; 
    imageKeys?: string[];
}

export interface IProduct {
    vendor: mongoose.Types.ObjectId;
    title: string;
    subDescription: string;
    description: string;
    category: mongoose.Types.ObjectId;
    brand?: string;
    //   imageKeys?: string[];
    status: string;
    size?: string;
    attributes?: Record<string, string>;
    variants: IProductVariant[];
}


const ProductVariantSchema = new mongoose.Schema({
    variantId: {
        type: String,
        required: true,
        unique: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    size: {
        type: String,
    },
    color: {
        type: String,
    },
    imageKeys: {
        type: [String],
        required: true,
        validator: {
            validator: function (arr: any) {
                return Array.isArray(arr) && arr.length > 0 
            },
            message: "Add atlest one image of product"
        }
    }
});

export const ProductSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subDescription: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductCategory",
            required: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            default: ProductStatusEnum.DRAFT
        },
        attributes: {
            type: Map,
            of: String, // Dynamic attributes common to all variants
        },
        variants: {
            type: [ProductVariantSchema],
            required: true, // Variants must always exist
            validate: {
                validator: function (variants: IProductVariant[]) {
                  // Check if `variantId` is unique within the same array
                  const variantIds = variants.map((variant) => variant.variantId);
                  const uniqueVariantIds = new Set(variantIds);
                  return variantIds.length === uniqueVariantIds.size;
                },
                message: "Each variantId must be unique within the product's variants.",
              },
        }
    },
    { timestamps: true }
);


