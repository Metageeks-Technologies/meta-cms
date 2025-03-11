import mongoose from "mongoose";


export interface ISiteMap {
    websiteKey: string,
    // servicePages: {
    //     loc: string,
    //     lastmod: string,
    //     changefreq: 'daily' | 'weekly' | 'monthly',
    //     priority: number
    // }[],
    // caseStudyPages: {
    //     loc: string,
    //     lastmod: string,
    //     changefreq: 'daily' | 'weekly' | 'monthly',
    //     priority: number
    // }[],
    // blogs: {
    //     loc: string,
    //     lastmod: string,
    //     changefreq: 'daily' | 'weekly' | 'monthly',
    //     priority: number
    // }[],
    sitemap: string
}


export const sitemapSchema = new mongoose.Schema<ISiteMap>({
    websiteKey: {
        type: String,
        required: true,
    },
    // servicePages: [
    //     {
    //         // pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
    //         loc: { type: String, required: true },
    //         lastmod: { type: Date, default: Date.now, required: true },
    //         changefreq: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    //         priority: { type: Number, default: 0.5 }
    //     }
    // ],
    // caseStudyPages: [
    //     {
    //         // caseStudyId: { type: mongoose.Schema.Types.ObjectId, ref: "CaseStudy", required: true },
    //         loc: { type: String, required: true },
    //         lastmod: { type: Date, default: Date.now, required: true },
    //         changefreq: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    //         priority: { type: Number, default: 0.5 }
    //     }
    // ],
    // blogs: [
    //     {
    //         // postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    //         loc: { type: String, required: true },
    //         lastmod: { type: Date, default: Date.now, required: true },
    //         changefreq: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    //         priority: { type: Number, default: 0.5 }
    //     }
    // ],
    sitemap: {
        type: String,
        required: true
    }
}, { timestamps: true }) 