import mongoose from "mongoose";


export enum PremissionEnum {
    BLOG = "blog",
    PAGE = "page",
    STORE = "store"
}

export interface IWebsite {
    _id: mongoose.Types.ObjectId,
    name: string,
    key: string,
    premissions: PremissionEnum[],
    admin: mongoose.Types.ObjectId,
    isDeleted: boolean
}


export const WebsiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
    },
    premissions: [
        {
            type: String,
            enum: Object.values(PremissionEnum),
            required: true
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });