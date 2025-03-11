import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { newUserWelcomeTemplate, resetPasswordOtpTemplate, userRoleChangeTemplate } from 'src/utils/emailTemplates';
import { RedisService } from '../redis/redis.service';
import { WebsiteService } from '../website/website.service';
const otpGenerator = require('otp-generator');


@Injectable()
export class UsersService {
  private readonly USER_PAGE_BATCH_LIMIT = 10;

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

    if (newUserDetails.role === UserRoleEnum.ADMIN && !newUserDetails.domain) {
      throw new BadRequestException("Website domain must be required");
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
        website = await this.websiteService.addWebsite(newUser, { name: newUserDetails.websiteName, permissions: newUserDetails.permissions, domain: newUserDetails.domain });
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
      sendEmail(newUser.email, "🎉 Welcome to Meta CMS – Your Account Details Inside!", newUserWelcomeTemplate(newUser.name, newUser.email, newUserDetails.password, newUser.role))
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error          text-transform: capitalize;

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

  // TODO: Remove this part when refactoring
  // async getStoreRole(_id: string) {
  //   // This function will be called by StoreRoleGuard on protected requests
  //   // So, it makes sense to use lean and only fetch required fields to reduce latency
  //   const user = await this.User.findOne({ _id: _id }, { storeRole: 1 }).lean();

  //   if (!user) {
  //     throw new NotFoundException("User not found");
  //   }

  //   return user.storeRole;
  // }

  async changeRole(websiteKey: string, userRole: UserRoleEnum, _id: string, newRole: UserRoleEnum) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException("Invalid website key");
    }

    if (newRole == UserRoleEnum.SUPERADMIN) {
      throw new HttpException("Cannot change role to superadmin", 400)
    }

    if (userRole !== UserRoleEnum.SUPERADMIN && newRole === UserRoleEnum.ADMIN) {
      throw new BadRequestException("Only Superadmin can chnage admin role")
    }

    const user = await this.User.findOne({ _id: _id, website: website._id }).lean().exec()
    if (!user) {
      throw new BadRequestException('User not found')
    }

    await this.User.updateOne({ _id: _id, website: website._id }, { $set: { role: newRole } }).exec();

    sendEmail(user.email, "🚀 Your Role Has Been Updated in Meta CMS", userRoleChangeTemplate(user.name, newRole))

    // await this.redisService.deleteCache(`${RedisKeys.User}_${_id}`);
  }

  // TODO: Remove this part when refactoring
  // async changeStoreRole(_id: string, newRole: UserStoreRoleEnum) {
  //   if (newRole == UserStoreRoleEnum.SUPERADMIN) {
  //     throw new HttpException("Cannot change role to superadmin", 400)
  //   }

  //   const query = await this.User.updateOne({ _id: _id }, { $set: { storeRole: newRole } }).exec();
  //   if (query.matchedCount == 0) {
  //     throw new NotFoundException("User ID not found");
  //   }

  // }

  async updateProfile(_id: string, updatedUserProfile: UpdateUserDto) {
    const query = await this.User.updateOne({ _id: _id }, { $set: updatedUserProfile }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException("User ID not found");
    }
  }

  async getUserBookmarks(websiteKey: string, userId: string, query: GetUserBookmarksQueryDto) {
    // Assuming userId is valid and verified by JWT

    const website = await this.websiteService.getWebsiteByKey(websiteKey)
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const bookmarks = await this.bookmarksService.getUserBookmarks(websiteKey, userId, query);
    return bookmarks;
  }

  async getAllAdmin(pageNo: string, searchQuery: string): Promise<IUser[]> {

    const page = parseInt(pageNo) || 1;
    const skip = (page - 1) * this.USER_PAGE_BATCH_LIMIT

    const query = { role: UserRoleEnum.ADMIN }
    let sortOption: any = { createdAt: -1 }

    if (searchQuery) {
      query['$text'] = { $search: searchQuery }
      sortOption = { score: { $meta: "textScore" }, createdAt: -1 }
    }

    const admins = await this.User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(this.USER_PAGE_BATCH_LIMIT)
      .select('-hash')
      .select(searchQuery && { score: { $meta: "textScore" } })
      .populate('website')
      .lean().exec();

    return admins;
  }

  async getAllUser(websiteKey: string, role: UserRoleEnum, pageNo: string, searchQuery: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException("Invalid website key");
    }

    const query = { role: role, website: website._id }
    let sortOption: any = { createdAt: -1 }

    const page = parseInt(pageNo) || 1;
    const skip = (page - 1) * this.USER_PAGE_BATCH_LIMIT

    if (searchQuery) {
      query['$text'] = { $search: searchQuery }
      sortOption = { score: { $meta: "textScore" }, createdAt: -1 }
    }

    const user = await this.User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(this.USER_PAGE_BATCH_LIMIT)
      .select(searchQuery && { score: { $meta: "textScore" } })
      .select('-hash')
      .populate('website')
      .lean().exec();
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

  // TODO: Remove this part when refactoring
  // async getAllStoreUsers(storeRole: UserStoreRoleEnum) {
  //   const query = storeRole === UserStoreRoleEnum.USER
  //     ? { $or: [{ storeRole: UserStoreRoleEnum.USER }, { storeRole: { $exists: false } }] }
  //     : { storeRole };

  //   const users = await this.User.find(query).select('-hash').sort({ createdAt: -1 }).lean().exec();
  //   return users
  // }

  async getUsersCount(websiteKey: string) {

    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException("Invalid website key");
    }


    const result = await this.User.aggregate([
      {
        $match: {
          website: website?._id
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


  // TODO: Remove this part when refactoring

  // async getStoreUsersCount() {
  //   const result = await this.User.aggregate([{
  //     $group: {
  //       _id: "$storeRole",
  //       count: { $count: {} }
  //     }
  //   },
  //   {
  //     $project: {
  //       count: 1
  //     }
  //   }]).exec();

  //   const counts = {};
  //   for (const key in result) {
  //     counts[result[key]._id] = result[key].count;
  //   }
  //   return counts;
  // }


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


  async blockUser(websiteKey: string, userRole: UserRoleEnum, userId: string) {

    if (userRole !== UserRoleEnum.SUPERADMIN) {
      const website = await this.websiteService.getWebsiteByKey(websiteKey);
      if (!website) {
        throw new BadRequestException("Invalid website key");
      }
    }

    const user = await this.User.findByIdAndUpdate(userId, { block: true })

    if (!user.name) {
      throw new NotFoundException('User not found')
    }

    if (user.role === UserRoleEnum.ADMIN) {
      await this.websiteService.deleteWebsite(user.website)
    }

  }

  async unBlockUser(websiteKey: string, userRole: UserRoleEnum, userId: string) {
    if (userRole !== UserRoleEnum.SUPERADMIN) {
      const website = await this.websiteService.getWebsiteByKey(websiteKey);
      if (!website) {
        throw new BadRequestException("Invalid website key");
      }
    }

    const user = await this.User.findByIdAndUpdate(userId, { block: false })

    if (!user.name) {
      throw new NotFoundException('User not found')
    }

    if (user.role === UserRoleEnum.ADMIN) {
      await this.websiteService.recoverWebsite(user.website)
    }
  }


  async changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.User.findById(userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (await bcrypt.compare(oldPassword, user.hash)) {
      user.hash = await bcrypt.hash(newPassword, 10)
      await user.save();
    } else {
      throw new ForbiddenException('Wrong password')
    }
  }

  

}
