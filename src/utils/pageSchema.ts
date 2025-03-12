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
