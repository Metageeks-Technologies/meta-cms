import mongoose from "mongoose";


export interface ICaseStudy extends mongoose.Document {
    title: string;
    websiteKey: string;
    authorId: mongoose.Types.ObjectId;
    slug: string;
    content: {
        heroSection: {
            imageKey: string
        },
        aboutSection: {
            heading: string,
            description: string,
            cards: {
                heading: string,
                description: string
            }[]
        },
        uiSection: {
            imageKey: string
        },
        serviceSection: {
            heading: string,
            description: string,
            imageKey: string
        },
        processSection: {
            heading: string,
            cards: {
                heading: string,
                list: string[]
            }[]
        },
        uiSection2: {
            heading: string,
            imageKey: string
        },
        challengesSection: {
            heading: string,
            description: string,
            cards: {
                heading: string,
                description: string,
            }[]
        }
    };
    isDeleted: boolean;
}


export const caseStudySchema = new mongoose.Schema<ICaseStudy>({
    title: {
        type: String,
        required: true
    },
    websiteKey: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        heroSection: {
            imageKey: { type: String, required: true }
        },
        aboutSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            cards: [
                {
                    heading: { type: String, required: true },
                    description: { type: String, required: true },
                }
            ]
        },
        uiSection: {
            imageKey: { type: String, required: true }
        },
        serviceSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            imageKey: { type: String, required: true }
        },
        processSection: {
            heading: { type: String, required: true },
            cards: [
                {
                    heading: { type: String, required: true },
                    list: [
                        { type: String, required: true }
                    ]
                }
            ]
        },
        uiSection2: {
            heading: { type: String, required: true },
            imageKey: { type: String, required: true }
        },
        challengesSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            cards: [
                {
                    heading: { type: String, required: true },
                    description: { type: String, required: true },
                }
            ]
        }
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true})