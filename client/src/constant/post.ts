import { NewPostFormData } from '../types';


export const postStatuEnum = {
  DRAFT: 'draft',
  AWAITING_APPROVAL: 'awaiting approval',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  REJECTED: 'rejected',
  DELETED: 'deleted'
}

export const statusArrAdminAllPost = [
  {
    label: 'All',
    query: ""
  },
  {
    label: 'Publish',
    query: postStatuEnum.PUBLISHED
  },
  {
    label: 'Draft',
    query: postStatuEnum.DRAFT
  },
  {
    label: 'Sheduled',
    query: postStatuEnum.SCHEDULED
  },
  {
    label: 'Rejected',
    query: postStatuEnum.REJECTED
  },
  {
    label: 'Awaiting Approval',
    query: postStatuEnum.AWAITING_APPROVAL
  },
  {
    label: 'Deleted',
    query: postStatuEnum.DELETED
  },
];


export const postSortByEnum = {
  TRENDING: 'trending',
  POPULAR: 'popular',
  RECENT: 'recent',
  OLDEST: 'oldest',
};

export const defaultNewPostData: NewPostFormData = {
  postTitle: "",
  postDescription: '',
  postStatus: 'draft',
  slug: '',
  category: [],
  tags: [],
  publishDate: null,
  previewImg: '',
}

export enum WebsiteEnum {
  METAGEEKS = "metageeks",
  FAMPROTOCAL = "famprotocal",
  GAMETERMINAL = "gameterminal",
  CLUSTERPROTOCAL = "clusterprotocal"
}