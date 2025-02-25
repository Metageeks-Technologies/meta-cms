import mongoose from "mongoose";


export enum PermissionEnum {
    BLOG = "blog",
    PAGE = "page",
    STORE = "store"
}

export interface IWebsite {
    _id: mongoose.Types.ObjectId,
    name: string,
    key: string,
    permissions: PermissionEnum[],
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
    permissions: [
        {
            type: String,
            enum: Object.values(PermissionEnum),
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


WebsiteSchema.index({ name: "text" })