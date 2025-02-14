import mongoose from 'mongoose';

export interface IProductCategory extends mongoose.Document {
  _id: string;
  name: string;
  description: string;
  bannerImageKey: string;
  websiteKey: string;
}

export const ProductCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  bannerImageKey: { type: String, required: true },
  websiteKey: { type: String, required: true }
}, { timestamps: true });