import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface LoginPayload {
  email: string;
  password: string
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface NewPostFormData {
  postTitle: string;
  postDescription: string;
  postStatus: string;
  slug: string;
  category: string[];
  tags: string[];
  publishDate: Date | null;
  previewImg: File | string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ProductAttribute {
  [key: string]: string | number; 
}

export interface ProductVariant {
  variantId: string;
  sku: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  size?: string | number; 
  color?: string; 
  weight?: string | number; 
  material?: string; 
  imageKeys: string[]; // Array of image keys
}

export interface CreateProductFormData {
  title: string;
  subDescription: string;
  description: string;
  category: string; // Can be an enum or union type depending on the use case
  website: string;
  brand: string;
  status: string; // Status types are good
  publishDate: Date | null;

  attributes: ProductAttribute; // Dynamic attributes object that can hold strings or numbers
  variants: ProductVariant[]; // Array of product variants
}

export interface ProductTypes {
  _id: string;
  title: string;
  subDescription: string;
  description: string;
  category: {
    _id: string;
    name: string;

  };
  brand: string;
  status: string;// Product status
  attributes: {
    [key: string]: string | number;
  };
  variants: ProductVariant[];
  isDeleted: boolean;

}

export interface PostTypes {
  author: any;
  _id: string;
  title: string;
  description: string;
  previewImageKey: string;
  tags: string[];
  categories: {
    _id: string,
    name: string,
  }[];
  authorId: string;
  likesCount: number;
  status: string;
  isDeleted: boolean;
  slug: string;
  publishedDate: string;
  commentCount: number;
  readTime?: string;
  website?: string;
}

export interface IWebsite {
  name: string;
  key: string;
  permissions: string[];
  admin: string;
  isDeleted: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phoneNo?: string;
  bio?: string;
  role: string;
  imageKey?: string;
  website?: IWebsite;
  block?: boolean;
  socialLinks?: {
    linkedIn?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}


export interface IComment {
  _id: string;
  userDetails?: UserProfile;
  postDetails: PostTypes;

  message: string;
  status: 'awaiting approval' | 'published' | 'rejected' | 'deleted';
  createdAt: string;
  verify: boolean;
  isDeleted: boolean;
}

export interface MenuItem {
  title: string; // Title of the menu item
  url?: string; // URL (optional for items with subMenu)
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | any; // Icon component
  subMenu?: MenuItem[]; // Optional sub-menu items
}

export interface MediaType {
  _id: string;
  fileName: string;
  folderName: string;
  key: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}

export interface PostContextType {
  categories: any[];
  productCategories: any[];
  fetchCategories: () => Promise<void>;
  // fetchProductCategories:()=> Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // deleteProductCategory: (id: string) => Promise<void>;
  fetchMedia: (lastId: string) => Promise<void>;
  media: MediaType[];
  setMedia: (arr: MediaType[]) => void,
  hasMoreMedia: boolean;
  isFetching: boolean;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  selectedCategory: string;
  selectedProductCategory: string;
  setSelectedCategory: (category: string) => void;
  setSelectedProductCategory: (category: string) => void;
  categoryPageNo: number;
  setCategoryPageNo: (num: number) => void
}

export type ProductContextType = {
  productCategories: any[];  // Update this with correct type if needed
  filterBy: string;
  setFilterBy: (filter: string) => void;
  sortBy: string;
  setSortBy: (filter: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  selectedProductCategory: string;
  setSelectedProductCategory: (filter: string) => void;
  fetchProductCategories: () => Promise<void>;
  deleteProductCategory: (id: string) => Promise<void>;
  productCategoryPageNo: number,
  setProductCategoryPageNo: (num: number) => void;
};


export interface Address {
  _id: string;
  house: string;
  street: string;
  landmark: string;
  postalCode: number;
  city: string;
  state: string;
  instruction: string;
  isDefault: boolean;
  isDeleted: boolean;
}
export interface AddressType {
  _id: string;
  name: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  landmark: string;
  postalCode: number | string;  // Changed to allow both number and string
  city: string;
  state: string;
  instruction?: string;
}

export type EditAddressProps = {
  editAddress: AddressType;
  setEditAddress: (address: AddressType | ((prev: AddressType) => AddressType)) => void;
  getUserAddresses: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export type PostOfficeData = {
  Status: string;
  PostOffice: Array<{
    District: string;
    State: string;
  }>;
}

export interface Vendor {
  name: string;
  email: string;
  phoneNo: string;
  bio: string;
  socialLinks: { [key: string]: string };
  imageKey: string;
}

export interface ProductDetails {
  _id: string;
  title: string;
  subDescription: string;
  description: string;
  variants: ProductVariant[];
  brand: string;
  status: string;
  attributes: { [key: string]: string };
  vendor: Vendor;
  category: {
    name: string;
    description: string;
    code: string;
    bannerImageKey: string;
  };
}

export interface ProductCardProps {
  product: ProductDetails;
}

export interface SectionContent {
  subHeading: string;
  heading: string;
  description: string;
  imageKey: string | null;
}

export interface Card {
  imageKey: string | null;
  heading: string;
  description: string;
}

export interface Caad {
  imageKey: string | null;
  name: string;
  company: string;
  message: string;
}

export interface Feature {
  imageKey: string | null;
  heading: string;
  description: string;
}

export interface ServicesSection {
  heading: string;
  description: string;
  cards: Card[];
}

export interface ProcessSection {
  heading: string;
  cards: { heading: string; description: string }[];
}

export interface FeatureSection {
  heading: string;
  features: Feature[];
}

export interface ForecastContent {
  subHeading: string;
  heading: string;
  imageKey: string | null;
  list: { point: string }[];
}

export interface PageContent {
  _id?: any;
  title: string;
  slug: string;
  website: string;
  service: string;
  subService: string;
  content: {
    heroSection: SectionContent;
    solutionSection1: SectionContent;
    servicesSection: ServicesSection;
    processSection: ProcessSection;
    solutionSection2: SectionContent;
    featureSection: FeatureSection;
    marketForecastSection: ForecastContent;
  };
  metaTitle: string,
  metaDescription: string,
  keywords: string[],
}


export interface aboutCard {
  heading: string;
  description: string;
}
export interface StudyAbout {
  heading: string;
  description: string;
  cards: aboutCard[];

}
export interface Content {
  imageKey: string | null;
  heading: string;
  description: string;
}

export interface Item {
  list: string
}

export interface StudyCard {
  heading: string;
  list: string[];
}

export interface process {
  heading: string;
  cards: StudyCard[];
}

export interface studyWebsite {
  heading: string;
  imageKey: string | null;
}

export interface studyChallange {
  heading: string;
  description: string;
  cards: aboutCard[]

}

export interface heroSection {
  imageKey: string | null;
}
export interface uiSection {
  imageKey: string | null;
}

export interface ServiceSection {
  imageKey: string | null;
  description: string
}

export interface caseStudyContent {
  _id?: any;
  title: string;
  slug: string;
  projectType: string;
  // website: string;
  // service: string;

  content: {
    heroSection: heroSection;
    aboutSection: StudyAbout;
    uiSection: uiSection;
    serviceSection: ServiceSection;
    processSection: process;
    uiSection2: studyWebsite;
    challengesSection: studyChallange;
  };
}


export interface AddressType {
  _id: string;
  name: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  landmark: string;
  postalCode: number | string;  // Changed to allow both number and string
  city: string;
  state: string;
  instruction?: string;
}

export interface WebsiteContextTypes {
  deleteWebsite: (id: string) => void,
  recoverWebsite: (id: string) => void,
  updateWebsite: (e: any, website: any, setIsOpen: any) => void,
  fetchWebsiteData: (searchQuery?: string) => void,
  websiteData: any[],
  websitePageNo: number,
  setWebsitePageNo: (num: number) => void,
}

export interface PageContextType {
  pageData: any,
  caseStudyData: any[],
  services: any,
  subServices: any,
  fetchPageData: () => void,
  fetchCaseStudyAll: () => void,
  recoverCaseStudy: (id: string) => void;
  deleteCaseStudy: (id: string) => void;
  fetchServices: () => void,
  fetchAllServices: () => void,
  fetchSubServices: (id: string) => void,

  recoverPage: (id: string) => void,
  recoverServices: (id: string) => void,
  recoverSubServices: (id: string, serviceId: string) => void,
  fetchSubServicesTotal: (id: string) => void,
  deletePage: (id: string) => void,
  deleteServices: (id: string) => void,
  deleteSubServices: (id: string, serviceId: string) => void,
  pageNo: number,
  setPageNo: (num: number) => void,
  servicePageNo: number,
  setServicePageNo: (num: number) => void,
  subServicePageNo: number,
  setSubServicePageNo: (num: number) => void,
  caseStudyPageNo: number,
  setCaseStudyPageNo: (num: number) => void,
}


export interface UserContextType {
  user: UserProfile;
  subscribers: UserProfile[];
  contributors: UserProfile[];
  moderators: UserProfile[];
  adminData: UserProfile[];
  storeUser: UserProfile[];
  vendor: UserProfile[];
  storeModerator: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUsers: (role: string, searchQuery?: string) => Promise<void>;
  fetchAdmins: (searchQuery?: string) => Promise<void>;
  fetchStoreRole: (storeRole: string) => Promise<void>;
  changeUserRole: (userId: string, currentRole: string, newRole: string) => Promise<void>;
  changeStoreRole: (userId: string, currentRole: string, newRole: string) => Promise<void>;
  getUserProfile: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  blockUser: (userId: string, role: string) => Promise<void>;
  unblockUser: (userId: string, role: string) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  website: any;
  websiteKey: string;
  setWebsiteKey: (key: string) => void;
  websiteData: any[];
  setWebsiteData: (data: any[]) => void;
  userPageNo: number;
  setUserPageNo: (num: number) => void;
  adminPageNo: number;
  setAdminPageNo: (num: number) => void;
};




export interface ChangePasswordFormType {
  oldPass: string,
  newPass: string,
  confirmNewPass: string
}