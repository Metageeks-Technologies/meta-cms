import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { IUser, UserRoleEnum, UserStoreRoleEnum } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { GetUserBookmarksQueryDto } from './dto/get-user-bookmarks.dto';
import { IOtp } from './schema/otp.schema';
import { sendEmail } from 'src/utils/emailService';
import { emailVerificationOtpTemplate, resetPasswordOtpTemplate } from 'src/utils/emailTemplates';
import { CloudCog } from 'lucide-react';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from 'src/utils/constant';
import { generateTempPassword } from 'src/utils/helperFunctions';
import { WebsiteService } from '../website/website.service';
const otpGenerator = require('otp-generator');


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private User: Model<IUser>,
    @InjectModel('Otp') private Otp: Model<IOtp>,
    private bookmarksService: BookmarksService,
    private readonly redisService: RedisService,
    private readonly websiteService: WebsiteService,
  ) { }

  async create(websiteKey: string, user: any, newUserDetails: CreateUserDto) {

    if (user.role !== UserRoleEnum.SUPERADMIN && !websiteKey) {
      throw new BadRequestException("Website key must be required")
    }

    if (!newUserDetails.role) {
      throw new BadRequestException("Role must be required")
    }

    if (user.role === UserRoleEnum.ADMIN && (newUserDetails.role === UserRoleEnum.ADMIN || newUserDetails.role === UserRoleEnum.SUPERADMIN)) {
      throw new UnauthorizedException();
    }

    if (newUserDetails.role === UserRoleEnum.ADMIN && !newUserDetails.websiteName) {
      throw new BadRequestException("Website name must be required");
    }

    const userExist = await this.User.findOne({ email: newUserDetails.email });
    if (userExist) {
      throw new BadRequestException('Email alredy exists')
    }

    const newUser = new this.User({
      name: newUserDetails.name,
      email: newUserDetails.email,
      role: newUserDetails.role,
      phoneNo: newUserDetails.phoneNo,
      bio: newUserDetails.bio,
      socialLinks: newUserDetails.socialLinks,
    });

    let website: any;
    if (newUserDetails.role === UserRoleEnum.ADMIN) {
      try {
        website = await this.websiteService.addWebsite(newUser, { name: newUserDetails.websiteName, premissions: newUserDetails.premissions });
      } catch (error) {
        throw new HttpException(error.message, 400);
      }
      newUser.website = website._id;
    } else {
      const website = await this.websiteService.getWebsiteByKey(websiteKey);
      newUser.website = website._id.toString();
    }

    // Hash the password
    newUser.hash = await bcrypt.hash(newUserDetails.password, 10);

    try {
      await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Email already exists');
      }

      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async findByEmail(email: string) {

    // return user if user email in cache 
    // const userData = await this.redisService.getCache(`${RedisKeys.User}_${email}`);
    // if(userData){
    //   return JSON.parse(userData);
    // }

    const user = await this.User.findOne({ email: email }).exec();

    if (!user) {
      throw new NotFoundException("Email not found");
    }

    // set user in cache by email 
    // this.redisService.setCache(`${RedisKeys.User}_${email}`, JSON.stringify(user));
    return user;
  }

  // This also hides the hash and other sensitive fields
  async findById(_id: string) {

    // return user if user id in cache 
    // const userData = await this.redisService.getCache(`${RedisKeys.User}_${_id}`);
    // if(userData){
    //   return JSON.parse(userData);
    // }

    const user = await this.User.findOne({ _id: _id }, { hash: 0, __v: 0 }).populate('website').exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // set user in cache by email 
    // this.redisService.setCache(`${RedisKeys.User}_${_id}`, JSON.stringify(user));
    return user;
  }

  async getRole(_id: string) {
    // This function will be called by RoleGuard on protected requests
    // So, it makes sense to use lean and only fetch required fields to reduce latency
    const user = await this.User.findOne({ _id: _id }, { role: 1 }).lean();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.role;
  }

  async getStoreRole(_id: string) {
    // This function will be called by StoreRoleGuard on protected requests
    // So, it makes sense to use lean and only fetch required fields to reduce latency
    const user = await this.User.findOne({ _id: _id }, { storeRole: 1 }).lean();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.storeRole;
  }

  async changeRole(_id: string, newRole: UserRoleEnum) {
    if (newRole == UserRoleEnum.SUPERADMIN) {
      throw new HttpException("Cannot change role to superadmin", 400)
    }

    const query = await this.User.updateOne({ _id: _id }, { $set: { role: newRole } }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException("User ID not found");
    }

    // await this.redisService.deleteCache(`${RedisKeys.User}_${_id}`);
  }

  async changeStoreRole(_id: string, newRole: UserStoreRoleEnum) {
    if (newRole == UserStoreRoleEnum.SUPERADMIN) {
      throw new HttpException("Cannot change role to superadmin", 400)
    }

    const query = await this.User.updateOne({ _id: _id }, { $set: { storeRole: newRole } }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException("User ID not found");
    }

  }

  async updateProfile(_id: string, updatedUserProfile: UpdateUserDto) {
    const query = await this.User.updateOne({ _id: _id }, { $set: updatedUserProfile }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException("User ID not found");
    }
  }

  async getUserBookmarks(userId: string, query: GetUserBookmarksQueryDto) {
    // Assuming userId is valid and verified by JWT
    const bookmarks = await this.bookmarksService.getUserBookmarks(userId, query);
    return bookmarks;
  }

  async getAllAdmin(): Promise<IUser[]> {
    const admins = await this.User.find({ role: UserRoleEnum.ADMIN }).sort({ createdAt: -1 }).select('-hash').populate('website').lean().exec();
    return admins;
  }

  async getAllUser(websiteKey: string, role: UserRoleEnum): Promise<IUser[]> {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException("Invalid website key");
    }

    const user = await this.User.find({ role: role, website: website._id }).sort({ createdAt: -1 }).select('-hash').populate('website').lean().exec();
    return user;
  }

  async getAllModerator(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.MODERATOR }).sort({ createdAt: -1 }).select('-hash').lean().exec();
    return users as IUser[];
  }

  async getAllContributor(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.CONTRIBUTOR }).sort({ createdAt: -1 }).select('-hash').lean().exec();
    return users as IUser[];
  }

  async getAllSubscribers(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.SUBSCRIBER }).sort({ createdAt: -1 }).select('-hash').lean().exec();
    return users as IUser[];
  }

  async getAllStoreUsers(storeRole: UserStoreRoleEnum) {
    const query = storeRole === UserStoreRoleEnum.USER
      ? { $or: [{ storeRole: UserStoreRoleEnum.USER }, { storeRole: { $exists: false } }] }
      : { storeRole };

    const users = await this.User.find(query).select('-hash').sort({ createdAt: -1 }).lean().exec();
    return users
  }

  async getUsersCount() {

    // const website = await this.websiteService.getWebsiteByKey(websiteKey);
    // if (!website) {
    //   throw new BadRequestException("Invalid website key");
    // }


    const result = await this.User.aggregate([
      {
        $match: {
          // websiteKey: websiteKey
        }
      },
      {
        $group: {
          _id: "$role",
          count: { $count: {} }
        }
      },
      {
        $project: {
          count: 1
        }
      }]).exec();

    const counts = {};
    for (const key in result) {
      counts[result[key]._id] = result[key].count;
    }
    return counts;
  }


  async getStoreUsersCount() {
    const result = await this.User.aggregate([{
      $group: {
        _id: "$storeRole",
        count: { $count: {} }
      }
    },
    {
      $project: {
        count: 1
      }
    }]).exec();

    const counts = {};
    for (const key in result) {
      counts[result[key]._id] = result[key].count;
    }
    return counts;
  }


  async sendResetPasswordOtp(email: string) {
    const user = await this.User.findOne({ email: email }, { name: 1 }).exec();

    if (!user?.name) {
      throw new NotFoundException('User not found');
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.Otp.create({
      email: email,
      otp: otp
    });

    const emailBody = resetPasswordOtpTemplate(user.name, otp)

    await sendEmail(
      email,
      "Resest password OTP - Meta-CMS",
      emailBody,
    )
  }

  async changePassword(email: string, otp: string, password: string) {

    const user = await this.User.findOne({ email: email }, { name: 1 }).exec();

    if (!user.name) {
      throw new NotFoundException('User not found');
    }

    const storedOtp = await this.Otp.findOne({ email: email }).sort({ createdAt: -1 });

    if (!storedOtp.otp) {
      throw new BadRequestException('OTP not found or has expired.')
    }

    if (storedOtp.otp !== otp) {
      throw new BadRequestException('Invalid Otp')
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await this.User.findOneAndUpdate({ email: email }, { hash: hashPassword });
  }


  async blockUser(userId: string) {
    const user = await this.User.findByIdAndUpdate(userId, { block: true }, { new: true })

    if (!user.name) {
      throw new NotFoundException('User not found')
    }
  }

  async unBlockUser(userId: string) {
    const user = await this.User.findByIdAndUpdate(userId, { block: false }, { new: true })

    if (!user.name) {
      throw new NotFoundException('User not found')
    }
  }

}
