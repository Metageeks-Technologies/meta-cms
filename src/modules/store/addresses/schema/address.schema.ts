import mongoose from "mongoose";


export interface IAddress {
    user: mongoose.Types.ObjectId,
    name: string,
    phone: string,
    email: string,
    house: string,
    street: string,
    landmark: string,
    postalCode: number,
    city: string,
    state: string,
    instruction: string,
    websiteKey: string,
    isDefault: boolean,
    isDeleted: boolean
}

export const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: true },
    postalCode: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    instruction: { type: String },
    websiteKey: {type: String, required: true},
    isDefault: {
        type: Boolean,
        default: false,
        required: true
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });