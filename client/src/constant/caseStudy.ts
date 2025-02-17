import { caseStudyContent } from "@/types";

export const INITIAL_CASESTUDY_CONTENT: caseStudyContent = {
  title: '',
  slug: '',
  website: '',
  service: '',
  content: {
    heroSection: {
      imageKey: null,
    },
    aboutSection: {
      heading: '',
      description: '',
      aboutCards: [
        {
          heading: '',
          description: ''
        }
      ]
    },
    uiSection1: null,
    serviceSection: {
      imageKey: null,
      heading: '',
      description: ''
    },
    processSection: {
      heading: '',
      cards: [
        {
          heading: '',
          cardList: [
            {
              list: ''
            }
          ]
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
      StudyChallangeList: [
        {
          heading: '',
          description: ''
        }
      ]
    }
  },
  _id: ''
};
