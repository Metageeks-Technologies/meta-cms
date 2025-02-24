import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  _id: string;
  name: string;
  description: string;
  websiteKey: string;
  bannerImageKey: string;
}

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  websiteKey: { type: String, required: true },
  bannerImageKey: { type: String, required: true },
}, { timestamps: true });


CategorySchema.index({ name: "text" });