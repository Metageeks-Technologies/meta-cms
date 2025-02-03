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
    website: string;
}
  
  export interface ProductAttribute {
    [key: string]: string | number; // or any other specific structure you have
  }
  
  export interface ProductVariant {
    variantId: string;
    sku: string;
    price: number;
    discountedPrice: number;
    quantity: number;
    size?: string | number; // Flexibility for size as string or number
    color?: string; // Assuming color will always be a string
    weight?: string | number; // Optional weight attribute
    material?: string; // Optional material attribute
    imageKeys: string[]; // Array of image keys
  }
  
  export interface CreateProductFormData {
    title: string;
    subDescription: string;
    description: string;
    category: string; // Can be an enum or union type depending on the use case
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


export interface UserProfile {
    id?: string; 
    name: string;
    email: string;
    phoneNo?: string;
    bio?: string;
    role: string;
    storeRole: string;
    imageKey?:string;
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
    productCategories:any[];
    fetchCategories: () => Promise<void>;
    fetchProductCategories:()=> Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    deleteProductCategory: (id: string) => Promise<void>;
    fetchMedia: (lastId: string) => Promise<void>;
    media: MediaType[];
    hasMoreMedia: boolean;
    isFetching: boolean;
    filterBy: string;
    setFilterBy: (filter: string) =>  void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    selectedCategory: string;
    selectedProductCategory:string;
    setSelectedCategory: (category: string) => void;
    setSelectedProductCategory: (category: string) => void;
}



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
  

