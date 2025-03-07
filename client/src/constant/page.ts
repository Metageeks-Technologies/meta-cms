import { PageContent } from "@/types";

export const INITIAL_PAGE_CONTENT: PageContent = {
    title: '',
    slug: '',
    website: '',
    service: '',
    subService: '',
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
        openGraph: {
            title: '',
            description: '',
            imageKey: ''
        }
    },
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    _id: ''
};



// export const PageService = [
//     {
//         key: "blockchain",
//         title: "Blockchain"
//     },
//     {
//         key: "ai",
//         title: "AI"
//     },
//     {
//         key: "gaming",
//         title: "Gaming"
//     },
//     {
//         key: "consulting",
//         title: "Consulting"
//     },
//     {
//         key: "industries",
//         title: "Industries"
//     },
// ]

// export const PageSubService = {
//     blockchain: [
//         {
//             key: 'core_blockchain',
//             title: 'Core Blockchain',
//         },
//         {
//             key: 'crypto',
//             title: "Crypto"
//         },
//         {
//             key: 'dapps',
//             title: "Dapps"
//         }
//     ],
//     ai:[
//         {
//             key: 'ai_solutions',
//             title: "AI Solutions"
//         },
//         {
//             key: 'robotics',
//             title: "Robotics"
//         }
//     ],
//     gaming: [
//         {
//             key: 'gaming_tech',
//             title: "Gaming Tech"
//         },
//         {
//             key: 'esports',
//             title: "Esports"
//         }
//     ],
//     consulting: [
//         {
//             key: 'consulting',
//             title: 'Consulting'
//         },
//     ],
//     industries: [
//         {
//             key: 'industries',
//             title: "Industries"
//         }
//     ]

// }