import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



export interface IService {
  name: string;
  description: string;
  websiteKey: string;
  isDeleted: boolean
}


export const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  websiteKey: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  },
}, { timestamps: true })


ServiceSchema.index({ name: 'text' })