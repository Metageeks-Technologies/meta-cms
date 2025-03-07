import { PageContent } from "@/types";

export const INITIAL_PAGE_CONTENT: PageContent = {
    title: '',
    slug: '',
    website: '',
    service: '',
    subService: '',
    // Add OG specific properties at the top level
    ogTitle: '',
    ogDescription: '',
    ogImageKey: '',
    content: {
        heroSection: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        solutionSection1: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        servicesSection: {
            heading: '',
            description: '',
            cards: [
                {
                    imageKey: '',
                    heading: '',
                    description: ''
                }
            ]
        },
        processSection: {
            heading: '',
            cards: [{
                heading: '',
                description: ''
            }]
        },
        solutionSection2: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        featureSection: {
            heading: '',
            features: [
                {
                    imageKey: '',
                    heading: '',
                    description: ''
                }
            ]
        },
        marketForecastSection: {
            subHeading: '',
            heading: '',
            imageKey: '',
            list: [{
                point: '',
            }]
        },
        // Keep this for backward compatibility if needed
       
    },
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    _id: ''
};