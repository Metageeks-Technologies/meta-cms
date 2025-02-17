import mongoose from 'mongoose';

export interface ILike extends mongoose.Document {
    _id: string;
    userId: string;
    postId: string;
    websiteKey: string;
}

export const LikeSchema = new mongoose.Schema({
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
    websiteKey: {
        type: String,
        required: true
    }
}, { timestamps: true });

LikeSchema.index( { postId: 1, userId: 1 }, { unique: true });