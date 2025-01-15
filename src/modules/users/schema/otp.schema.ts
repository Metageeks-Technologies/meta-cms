import mongoose from 'mongoose';
import { sendEmail } from 'src/utils/emailService';


export interface IOtp extends mongoose.Document {
    email: string,
    otp: string
};

export const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, 
  },
}, { timestamps: true });
