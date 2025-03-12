import { ICaseStudy } from "src/modules/caseStudy/schema/caseStudy.schema";
import { IPage } from "src/modules/pages/schema/page.schema";
import { IWebsite } from "src/modules/website/schema/website.schema";



export function generateJsonLdForServicePage(website: IWebsite, page: IPage) {
    const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page?.title,
        "url": `${website?.domain}/${page?.slug}`,
        "description": page?.metaDescription || page?.content?.heroSection?.description,
        "keywords": page?.keywords?.join(", "),
        "isPartOf": {
            "@type": "WebSite",
            "name": website?.name,
            "url": website?.domain
        },
        "author": {
            "@type": "Organization",
            "name": website?.name,
            "url": website?.domain
        },
        "dateModified": page?.updatedAt.toISOString(),
        "mainEntity": {
            "@type": "Service",
            "name": page?.service,
            "serviceType": page?.subService,
            "provider": {
                "@type": "Organization",
                "name": website?.name
            },
            "description": page?.content?.heroSection?.description,
        },
        "image": `${process.env.IMAGE_CDN}/${page?.content?.heroSection?.imageKey}`,
        "offers": {
            "@type": "Offer",
            "url": `${website?.domain}/${page?.slug}`,
            "availability": "https://schema.org/InStock"
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": page?.content?.solutionSection1?.heading,
                "description": page?.content?.solutionSection1?.description
            },
            {
                "@type": "WebPageElement",
                "name": page?.content?.servicesSection?.heading,
                "description": page?.content?.servicesSection?.description,
                "hasPart": page?.content?.servicesSection?.cards?.map(card => ({
                    "@type": "Service",
                    "name": card?.heading,
                    "description": card?.description
                }))
            },
            {
                "@type": "WebPageElement",
                "name": page?.content?.featureSection?.heading,
                "hasPart": page?.content?.featureSection?.features?.map(feature => ({
                    "@type": "CreativeWork",
                    "name": feature?.heading,
                    "description": feature?.description
                }))
            }
        ]
    };

    return JSON.stringify(jsonLd, null, 2);
}


export function generateJsonLdForCaseStudy(website: IWebsite, caseStudy: ICaseStudy) {
    const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": caseStudy?.title,
        "url": `${website?.domain}/${caseStudy?.slug}`,
        "description": caseStudy?.metaDescription || caseStudy?.content?.aboutSection?.description,
        "keywords": caseStudy?.keywords?.join(", "),
        "isPartOf": {
            "@type": "WebSite",
            "name": website?.name,
            "url": website?.domain
        },
        "author": {
            "@type": "Organization",
            "name": website?.name,
            "url": website?.domain
        },
        "dateModified": caseStudy?.updatedAt.toISOString(),
        "mainEntity": {
            "@type": "CreativeWork",
            "name": caseStudy?.title,
            "description": caseStudy?.content?.aboutSection?.description,
            "provider": {
                "@type": "Organization",
                "name": website?.name
            }
        },
        "image": `${process.env.IMAGE_CDN}/${caseStudy?.content?.heroSection?.imageKey}`,
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": caseStudy?.content?.aboutSection?.heading,
                "description": caseStudy?.content?.aboutSection?.description,
                "hasPart": caseStudy?.content?.aboutSection?.cards?.map(card => ({
                    "@type": "CreativeWork",
                    "name": card?.heading,
                    "description": card?.description
                }))
            },
            {
                "@type": "WebPageElement",
                "name": caseStudy?.content?.serviceSection?.description,
                "image": `${process.env.IMAGE_CDN}/${caseStudy?.content?.serviceSection?.imageKey}`
            },
            {
                "@type": "WebPageElement",
                "name": caseStudy?.content?.processSection?.heading,
                "hasPart": caseStudy?.content?.processSection?.cards?.map(card => ({
                    "@type": "CreativeWork",
                    "name": card?.heading,
                    "hasPart": card?.list?.map(item => ({
                        "@type": "ListItem",
                        "name": item
                    }))
                }))
            },
            {
                "@type": "WebPageElement",
                "name": caseStudy?.content?.challengesSection?.heading,
                "description": caseStudy?.content?.challengesSection?.description,
                "hasPart": caseStudy?.content?.challengesSection?.cards?.map(card => ({
                    "@type": "CreativeWork",
                    "name": card?.heading,
                    "description": card?.description
                }))
            }
        ],
        "offers": {
            "@type": "Offer",
            "url": `${website?.domain}/${caseStudy?.slug}`,
            "availability": "https://schema.org/InStock"
        },
        "ogTitle": caseStudy?.ogTitle,
        "ogDescription": caseStudy?.ogDescription,
        "ogImage": `${process.env.IMAGE_CDN}/${caseStudy?.ogImageKey}`
    };

    return JSON.stringify(jsonLd, null, 2);
}
