import { timeStamp } from "console";
import mongoose from "mongoose";


export enum PageServiceEnum {
    BLOCKCHAIN= "blockchain",
    AI= 'ai',
    GAMING= 'gaming',
    CONSULTING= 'consulting',
    INDUSTRIES= 'industries',
    ABOUTUS= 'aboutus',
    CONTACTUS= 'contactus'
}

export enum PageSubServiceEnum {
    CORE_BLOCKCHAIN = 'core_blockchain',
    CRYPTO = 'crypto',
    DAPPS = 'dapps',
    AI_SOLUTIONS = 'ai_solutions',
    ROBOTICS = 'robotics',
    GAMING_TECH = 'gaming_tech',
    ESPORTS = 'esports',
    CONSULTING = 'consulting',
    INDUSTRIES = 'industries'
}


export interface IPage extends mongoose.Document {
    _id: string;
    title: string;
    service: string;
    subService: string;
    slug: string;
    authorId: mongoose.Types.ObjectId;
    content: {
        heroSection: {
            subHeading: string,
            heading: string,
            description: string,
            imageKey: string,
        },
        solutionSection1: {
            subHeading: string
            heading: string,
            description: string,
            imageKey: string
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
            subHeading: string
            heading: string,
            description: string,
            imageKey: string
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
            imageKey: string,
            subHeading: string,
            heading: string,
            list: {
                point: string
            }[]
        },
    }
    isDeleted: boolean;
    isActive: boolean;
}

export const PageSchema = new mongoose.Schema<IPage>({
    title: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        enum: Object.values(PageServiceEnum)
    }, 
    subService: {
        type: String,
        enum: Object.values(PageSubServiceEnum)
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
            description: { type: String, required: true },
            imageKey: { type: String, required: true }
        },
        solutionSection1: {
            subHeading: { type: String, required: true },
            heading: { type: String, required: true },
            description: { type: String, required: true },
            imageKey: { type: String, required: true }
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
            subHeading: { type: String, required: true },
            heading: { type: String, required: true },
            description: { type: String, required: true },
            imageKey: { type: String, required: true }
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
            imageKey: { type: String, required: true },
            subHeading: { type: String, required: true },
            heading: { type: String, required: true },
            list: [
                {
                    point: { type: String, required: true }
                }
            ]
        },
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