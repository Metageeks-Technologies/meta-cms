import mongoose from 'mongoose';


export enum OrderStatusEnum {
    PENDING = 'pending',
    CONFIRM = 'confirm',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentTypeEnum {
    CASH_ON_DELIVERY = 'cash_on_delivery', // Not from Razorpay, but keeping it for reference
    UPI = 'upi',
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    NET_BANKING = 'net_banking',
    WALLET = 'wallet',
    EMI = 'emi',
    PAY_LATER = 'pay_later',
    CARDLESS_EMI = 'cardless_emi',
    BANK_TRANSFER = 'bank_transfer',
}


export enum PaymentStatusEnum {
    PAID = "paid",
    UNPAID = "unpaid"
}

export interface IItem {
    product: mongoose.Types.ObjectId;
    variantId: string;
    sku: string;
    quantity: number;
}


export interface IOrder {
    user: mongoose.Types.ObjectId; // User who placed the order
    vendor: mongoose.Types.ObjectId; // User who recived the order
    items: IItem[]; // Array of items in the order
    totalAmount: number; // Total amount for the entire order
    shippingAddress: mongoose.Types.ObjectId; // Shipping address for the order
    shippingStatus: string; // Status of the overall shipping ('pending', 'shipped', 'delivered')
    paymentStatus: string; // Payment status ('paid', 'unpaid')
    websiteKey: string;
    // paymentType: string; // Type of payment (e.g., cash_on_delivery, upi)
    isCancelled: boolean; // If the order has been cancelled
}

const OrderItemSchema = new mongoose.Schema<IItem>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
        min: 1,
    },
}, {_id: false});


export const OrderSchema = new mongoose.Schema<IOrder>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        shippingStatus: {
            type: String,
            enum: Object.values(OrderStatusEnum),
            default: OrderStatusEnum.PENDING,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatusEnum),
            default: PaymentStatusEnum.UNPAID,
        },
        websiteKey: {
            type: String,
            required: true
        },
        // paymentType: {
        //     type: String,
        //     enum: Object.values(PaymentTypeEnum),
        //     default: PaymentTypeEnum.CASH_ON_DELIVERY,
        // },
        isCancelled: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

