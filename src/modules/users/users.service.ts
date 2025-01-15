import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { IUser, UserRoleEnum } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { GetUserBookmarksQueryDto } from './dto/get-user-bookmarks.dto';
import { IOtp } from './schema/otp.schema';
import { sendEmail } from 'src/utils/emailService';
import { emailVerificationOtpTemplate, resetPasswordOtpTemplate } from 'src/utils/emailTemplates';
import { CloudCog } from 'lucide-react';
const otpGenerator = require('otp-generator');


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private User: Model<IUser>,
    @InjectModel('Otp') private Otp: Model<IOtp>,
    private bookmarksService: BookmarksService
  ) { }

  async create(newUserDetails: CreateUserDto) {
    const newUser = new this.User(newUserDetails);

    // Hash the password
    newUser.hash = await bcrypt.hash(newUserDetails.password, 10);

    try {
      await newUser.save();
      return newUser;
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
    const user = await this.User.findOne({ email: email }).exec();

    if (!user) {
      throw new NotFoundException("Email not found");
    }
    return user;
  }

  // This also hides the hash and other sensitive fields
  async findById(_id: string) {
    const user = await this.User.findOne({ _id: _id }, { hash: 0, __v: 0 }).exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

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

  async changeRole(_id: string, newRole: UserRoleEnum) {
    if (newRole == UserRoleEnum.SUPERADMIN) {
      throw new HttpException("Cannot change role to superadmin", 400)
    }

    const query = await this.User.updateOne({ _id: _id }, { $set: { role: newRole } }).exec();
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

  async getAllModerator(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.MODERATOR }).sort({ createdAt: -1 }).lean().exec();
    return users as IUser[];
  }

  async getAllContributor(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.CONTRIBUTOR }).sort({ createdAt: -1 }).lean().exec();
    return users as IUser[];
  }

  async getAllSubscribers(): Promise<IUser[]> {
    // Assuming user verified as super Admin
    const users = await this.User.find({ role: UserRoleEnum.SUBSCRIBER }).sort({ createdAt: -1 }).lean().exec();
    return users as IUser[];
  }

  async getUsersCount() {
    const result = await this.User.aggregate([{
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
