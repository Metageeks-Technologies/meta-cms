import mongoose from 'mongoose';

export interface IMedia extends mongoose.Document {
  _id: string;
  folderName: string;
  fileName: string;
  key: string;
}

export const MediaSchema = new mongoose.Schema({
  folderName: { type: String, required: true},
  fileName: { type: String, required: true },
  key: { type: String, required: true },
}, { timestamps: true });

MediaSchema.index({ key: 1 }, { unique: true });