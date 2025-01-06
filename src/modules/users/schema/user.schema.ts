import mongoose from 'mongoose';

export enum UserRoleEnum {
  SUBSCRIBER = 'subscriber',
  CONTRIBUTOR = 'contributor',
  MODERATOR = 'moderator',
  SUPERADMIN = 'superadmin',
};

interface ISocialLinks {
  linkedIn: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  hash: string;
  phoneNo?: string;
  bio?: string;
  role: UserRoleEnum;
  socialLinks?: ISocialLinks;
};

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  phoneNo: { type: String, required: false },
  bio: { type: String, required: false },
  role: {
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.SUBSCRIBER,
    required: true
  },
  socialLinks: {
    linkedIn: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String }
  }
}, { timestamps: true });