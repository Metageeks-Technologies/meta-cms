import mongoose from "mongoose";

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    variantId: string;
    sku: string;
    quantity: number;
}

export interface ICart {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    websiteKey: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variantId: {
            type: String,
            required: true,
        },
        sku: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },
    },
    { _id: false }, // Prevent Mongoose from adding an `_id` to each item
);

export const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: {
            type: [CartItemSchema],
            default: [],
            validate: {
                validator: function (items: ICartItem[]) {
                    // Ensure no duplicate items with the same product and variantId
                    const uniqueKeys = new Set(items.map((item) => `${item.product}-${item.variantId}`));
                    return uniqueKeys.size === items.length;
                },
                message: "Duplicate product and variant combinations are not allowed in the cart.",
            },
        },
        websiteKey: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
);

export const Cart = mongoose.model("Cart", CartSchema);
