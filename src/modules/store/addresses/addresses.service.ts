import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IAddress } from "./schema/address.schema";
import mongoose, { Model } from "mongoose";
import { RedisService } from "src/modules/redis/redis.service";
import { CreateAddressDto } from "./dto/create-address-dto";
import { UpdateAddressDto } from "./dto/update-address-dto";
import { UserRoleEnum } from "src/modules/users/schema/user.schema";
import { RedisKeys } from "src/utils/constant";
import { WebsiteService } from "src/modules/website/website.service";



@Injectable()
export class AddressService {
    constructor(
        @InjectModel('Address') private Address: Model<IAddress>,
        private readonly redisService: RedisService,
        private readonly websiteService: WebsiteService
    ) { }


    async create(websiteKey: string, userId: string, addressDetails: CreateAddressDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const newAddress = new this.Address({
            ...addressDetails,
            websiteKey,
            user: new mongoose.Types.ObjectId(userId)
        });

        try {
            await newAddress.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create address');
        }
    }

    async getUserAllAddress(websiteKey: string, authorId: string, isDeleted?: boolean) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = { user: authorId, websiteKey }
        if (isDeleted === false) {
            query['isDeleted'] = false;
        }
        const addresses = await this.Address.find(query).sort({ createdAt: -1 }).lean().exec();
        if (addresses.length === 0) {
            return [];
        }
        return addresses;
    }

    async getAddressById(websiteKey: string, addressId: string, authorId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const address = await this.Address.findOne({ _id: addressId, websiteKey, isDeleted: false }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        return address
    }

    async update(websiteKey: string, addressId: string, userId: string, userRole: UserRoleEnum, addressDetails: UpdateAddressDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const address = await this.Address.findOne({ _id: addressId, websiteKey, isDeleted: false }, { user: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && address.user.toString() !== userId) {
            throw new ForbiddenException();
        }

        await this.Address.updateOne({ _id: addressId }, { $set: addressDetails }).exec();
    }

    async markAsDefault(websiteKey: string, addressId: string, authorId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const address = await this.Address.findOne({ _id: addressId, websiteKey, isDeleted: false }, { user: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        // Set all addresses for the user to isDefault: false
        await this.Address.updateMany(
            { user: authorId, websiteKey },
            { $set: { isDefault: false } }
        );

        // Set the specific address as the default
        await this.Address.updateOne(
            { _id: addressId, websiteKey },
            { $set: { isDefault: true } }
        );

    }

    async delete(websiteKey: string, addressId: string, authorId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const address = await this.Address.findOne({ _id: addressId, websiteKey }, { user: 1, isDeleted: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (address.isDeleted) {
            throw new ConflictException('Address already deleted');
        }


        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        await this.Address.updateOne({ _id: addressId }, { isDeleted: true }).exec();
    }

    async recoverAddress(websiteKey: string, addressId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const address = await this.Address.updateOne({ _id: addressId, websiteKey }, { isDeleted: false, isDefault: false })

        if (!address) {
            throw new NotFoundException('Address not found');
        }
    }

}