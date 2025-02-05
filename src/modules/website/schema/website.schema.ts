import mongoose from "mongoose";


export interface IWebsite {
    _id: mongoose.Types.ObjectId,
    name: string,
    key: string,
    isDeleted: boolean
}


export const WebsiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })