import mongoose from "mongoose";


export interface IRSS {
    websiteKey: string,
    rss: string
}


export const rssSchema = new mongoose.Schema<IRSS>({
    websiteKey: {
        type: String,
        required: true,
    },
    rss: {
        type: String,
        required: true
    }
}, { timestamps: true }) 