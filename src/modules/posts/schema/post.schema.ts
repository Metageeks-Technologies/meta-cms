import mongoose from 'mongoose';

export enum PostStatusEnum {
    DRAFT = 'draft',
    AWAITING_APPROVAL = 'awaiting approval',
    PUBLISHED = 'published',
    SCHEDULED = 'scheduled',
    REJECTED = 'rejected',
};

export interface IPost extends mongoose.Document {
    _id: string;
    title: string;
    description: string;
    previewImageKey: string;
    tags?: string[];
    categories: mongoose.Types.ObjectId[];
    authorId: mongoose.Types.ObjectId;
    likesCount: number;
    commentCount: number;
    status: PostStatusEnum;
    isDeleted: boolean;
    slug: string;
    publishedDate: string;
};

export const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    previewImageKey: { type: String, required: true },
    tags: { type: [String], required: false },
    categories: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }],
        default: undefined,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likesCount: { type: Number, required: true, default: 0 },
    commentCount: {type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: Object.values(PostStatusEnum),
        default: PostStatusEnum.DRAFT,
        required: true,
    },
    isDeleted: { type: Boolean, required: true, default: false },
    slug: { type: String, required: true, unique: true },
    publishedDate: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

// Create a text index for title, description, and tags
PostSchema.index({ title: 'text', description: 'text', tags: 'text' });