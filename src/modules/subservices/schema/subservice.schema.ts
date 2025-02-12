import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subservice extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Service' })
  serviceId: string;  // Reference to the parent service

  @Prop({ type: String, ref: 'User', required: true })  
  websiteKey: string;

  @Prop({ type: Date, default: null })  // Soft delete timestamp
  deletedAt: Date;
}

export const SubserviceSchema = SchemaFactory.createForClass(Subservice);
