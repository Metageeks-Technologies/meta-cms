import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: String, ref: 'Subservice' }] })
  subservices: string[];

  
  @Prop({ type: String, ref: 'User', required: true })  
  websiteKey: string;

  @Prop({ type: Date, default: null })  // Soft delete timestamp
  deletedAt: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
