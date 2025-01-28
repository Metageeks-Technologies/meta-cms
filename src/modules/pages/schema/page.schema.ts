import { timeStamp } from "console";
import mongoose from "mongoose";


export interface IPage extends mongoose.Document {
    _id: string;
    title: string;
    authorId: mongoose.Types.ObjectId;
    content: {
        heroSection: {
            subHeading: string,
            heading: string,
            description: string
        },
        solutionSection1: {
            heading: string,
            description: string
        },
        servicesSection: {
            heading: string,
            description: string,
            cards: {
                imageKey: string,
                heading: string,
                description: string
            }[]
        },
        processSection: {
            heading: string,
            cards: {
                heading: string,
                description: string
            }[]
        },
        solutionSection2: {
            heading: string,
            description: string
        },
        featureSection: {
            heading: string,
            features: {
                imageKey: string,
                heading: string,
                description: string
            }[]
        },
        marketForecastSection: {
            heading: string,
            list: {
                point: string
            }[]
        },
        whyChooseSection: {
            heading: string,
            description: string,
            cards: {
                heading: string,
                description: string
            }[]
        },
        reviewsSection: {
            heading: string,
            description: string,
            cards: {
                message: string,
                imageKey: string,
                name: string,
                company: string
            }[]
        }
    }
    isDeleted: boolean;
    isActive: boolean;
}

export const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        heroSection: {
            subHeading: { type: String, required: true },
            heading: { type: String, required: true },
            description: { type: String, required: true }
        },
        solutionSection1: {
            heading: { type: String, required: true },
            description: { type: String, required: true }
        },
        servicesSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            cards: [
                {
                    imageKey: { type: String, required: true },
                    heading: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ]
        },
        processSection: {
            heading: { type: String, required: true },
            cards: [
                {
                    heading: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ]
        },
        solutionSection2: {
            heading: { type: String, required: true },
            description: { type: String, required: true }
        },
        featureSection: {
            heading: { type: String, required: true },
            features: [
                {
                    imageKey: { type: String, required: true },
                    heading: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ]
        },
        marketForecastSection: {
            heading: { type: String, required: true },
            list: [
                {
                    point: { type: String, required: true }
                }
            ]
        },
        whyChooseSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            cards: [
                {
                    heading: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ]
        },
        reviewsSection: {
            heading: { type: String, required: true },
            description: { type: String, required: true },
            cards: [
                {
                    message: { type: String, required: true },
                    imageKey: { type: String, required: true },
                    name: { type: String, required: true },
                    company: { type: String, required: true }
                }
            ],
        }
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })