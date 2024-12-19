import mongoose from 'mongoose';

export interface ISubscriber extends mongoose.Document {
  _id: string;
  email: string;
}

export const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });