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
    previewImg: File | string |null;
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
}


export interface UserProfile {
    id?: string; 
    name: string;
    email: string;
    phoneNo?: string;
    bio?: string;
    role: string;
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
    status: 'awaiting approval' | 'published' | 'rejected' |'deleted';
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
    fetchCategories: () => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    fetchMedia: (lastId: string) => Promise<void>;
    media: MediaType[];
    hasMoreMedia: boolean;
    isFetching: boolean;
    filterBy: string;
    setFilterBy: (filter: string) =>  void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}


