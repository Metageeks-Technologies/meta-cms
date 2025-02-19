import { JwtService } from '@nestjs/jwt';
import mongoose, { mongo } from 'mongoose';
import { sendEmail } from 'src/utils/emailService';

export enum UserRoleEnum {
  SUBSCRIBER = 'subscriber',
  CONTRIBUTOR = 'contributor',
  MODERATOR = 'moderator',
  ADMIN= 'admin',
  SUPERADMIN = 'superadmin',
};

// export enum UserStoreRoleEnum {
//   USER = 'user',
//   VENDOR = 'vendor',
//   MODERATOR = 'moderator',
//   SUPERADMIN = 'superadmin',
// };

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
  imageKey?:string;
  bio?: string;
  block: boolean;
  role: UserRoleEnum;
  // storeRole: UserStoreRoleEnum;
  website: string;
  socialLinks?: ISocialLinks;
  lastLoginIp?: string;
};

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  phoneNo: { type: String, required: false },
  bio: { type: String, required: false },
  imageKey: { type: String },
  block: {
    type: Boolean,
    default: false,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.SUBSCRIBER,
    required: true
  },
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Website",
    required: true,
  },
  // storeRole: {
  //   type: String,
  //   enum: Object.values(UserStoreRoleEnum),
  //   default: UserStoreRoleEnum.USER,
  //   required: true
  // },
  socialLinks: {
    linkedIn: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String }
  },
  lastLoginIp: { type: String }
}, { timestamps: true });
