import { caseStudyContent } from "@/types";

export const INITIAL_CASESTUDY_CONTENT: caseStudyContent = {
  title: '',
  slug: '',
  projectType: '',
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  ogTitle: '',
  ogDescription: '',
  ogImageKey: '',
  content: {
    heroSection: {
      imageKey: null,
    },
    aboutSection: {
      heading: '',
      description: '',
      cards: [
        {
          heading: '',
          description: ''
        }
      ]
    },
    uiSection: {
      imageKey:null
    },
    serviceSection: {
      imageKey: null,
      description: ''
    },
    processSection: {
      heading: '',
      cards: [
        {
          heading: '',
          list: []
        }
      ]
    },
    uiSection2: {
      heading: '',
      imageKey: null
    },
    challengesSection: {
      heading: '',
      description: '',
      cards: [
        {
          heading: '',
          description: ''
        }
      ]
    }
  },
  _id: ''
};
