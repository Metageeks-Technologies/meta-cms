export interface LoginPayload {
    email: string;
    password: string
}

export interface SignUpFormData {
    firstName: string;
    lastName: string;
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
    visibility: string;
    category: string[];
    tags: string[];
    publishDate: Date | null;
    previewImg: File | null;
}


export interface PostTypes {
    id: string;
    title: string;
    description: string;
    previewImageKey: string;
    tags: string[];
    categories: string[];
    authorId: string;
    likesCount: number;
    status: string;
    isDeleted: boolean;
    slug: string;
    publishedDate: string;
}


export interface UserProfile {
    id: string; 
    name: string;
    email: string;
    phoneNo?: string;
    bio?: string;
    role: string;
    socialLinks?: {
      linkedIn?: string;
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
}
  

export interface Comment {
    id: number;
    postId: number;
    user: string;
    content: string;
    date: string;
}