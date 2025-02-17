import mongoose from "mongoose";


export interface IPermission {
    name: string,
    description: string,
    isDeleted: boolean,
}


export const PermissionSchema = new mongoose.Schema({
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