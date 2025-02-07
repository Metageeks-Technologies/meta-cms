import mongoose from "mongoose";


export interface IPremission {
    name: string,
    description: string,
    isDeleted: boolean,
}


export const PremissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    isDeleted: {
        type: String,
        required: true,
        default: false,
    }
}, { timestamps: true })