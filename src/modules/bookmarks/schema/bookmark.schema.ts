import mongoose from 'mongoose';

export interface IBookmark extends mongoose.Document {
  _id: string;
  userId: string;
  postId: string;
}

export const BookmarkSchema = new mongoose.Schema({
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
}, { timestamps: true });

BookmarkSchema.index( { userId: 1, postId: 1 }, { unique: true } );