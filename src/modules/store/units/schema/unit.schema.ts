import mongoose from "mongoose";


export interface IUnit {
    name: string,
    descroiption: string,
    isDeleted: boolean,
} 


export const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true })