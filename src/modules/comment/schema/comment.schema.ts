import mongoose from "mongoose";

export enum CommentStatusEnum {
    AWAITING_APPROVAL = 'awaiting approval',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
}

export interface IComment extends mongoose.Document {
    userId : mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
    message: string,
    status: CommentStatusEnum,
    isDeleted: boolean,
}

export const CommentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(CommentStatusEnum),
        required: true,
        default: CommentStatusEnum.AWAITING_APPROVAL
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }

}, { timestamps: true })