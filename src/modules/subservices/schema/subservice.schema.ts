import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



export interface ISubservice {
  name: string;
  description: string;
  key: string;
  service: mongoose.Types.ObjectId;
  websiteKey: string;
  isDeleted: boolean;
}


export const SubserviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  websiteKey: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true });
