import { timeStamp } from "console";
import mongoose from "mongoose";


export interface IPage extends mongoose.Document {
    _id: string;
    authorId: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    isDeleted: boolean;

}

export const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    authorId : {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    isDeleted : {
        type: Boolean,
        required: true,
        default: false,
    }

}, { timestamps: true })