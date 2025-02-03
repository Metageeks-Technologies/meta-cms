import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IAddress } from "./schema/address.schema";
import mongoose, { Model } from "mongoose";
import { RedisService } from "src/modules/redis/redis.service";
import { CreateAddressDto } from "./dto/create-address-dto";
import { UpdateAddressDto } from "./dto/update-address-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { RedisKeys } from "src/utils/constant";



@Injectable()
export class AddressService {
    constructor(
        @InjectModel('Address') private Address: Model<IAddress>,
        private readonly redisService: RedisService
    ) { }


    async create(userId: string, addressDetails: CreateAddressDto) {
        const newAddress = new this.Address({
            ...addressDetails,
            user: new mongoose.Types.ObjectId(userId)
        });

        try {
            await newAddress.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create address');
        }
    }

    async getUserAllAddress(authorId: string, isDeleted?: boolean) {
        const query = { user: authorId }
        if (isDeleted === false) {
            query['isDeleted'] = false;
        }
        const addresses = await this.Address.find(query).sort({ createdAt: -1 }).lean().exec();
        if (addresses.length === 0) {
            return [];
        }
        return addresses;
    }

    async getAddressById(addressId: string, authorId: string, storeRole: UserStoreRoleEnum) {
        const address = await this.Address.findOne({ _id: addressId, isDeleted: false }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        return address
    }

    async update(addressId: string, userId: string, storeRole: UserStoreRoleEnum, addressDetails: UpdateAddressDto) {
        const address = await this.Address.findOne({ _id: addressId, isDeleted: false }, { user: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }
        console.log(storeRole, "Store role")

        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && address.user.toString() !== userId) {
            throw new ForbiddenException();
        }

        await this.Address.updateOne({ _id: addressId }, { $set: addressDetails }).exec();
    }

    async markAsDefault(addressId: string, authorId: string, storeRole: UserStoreRoleEnum) {
        const address = await this.Address.findOne({ _id: addressId, isDeleted: false }, { user: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        // Set all addresses for the user to isDefault: false
        await this.Address.updateMany(
            { user: authorId, isDeleted: false },
            { $set: { isDefault: false } }
        );

        // Set the specific address as the default
        await this.Address.updateOne(
            { _id: addressId },
            { $set: { isDefault: true } }
        );

    }

    async delete(addressId: string, authorId: string, storeRole: UserStoreRoleEnum) {
        const address = await this.Address.findOne({ _id: addressId }, { user: 1, isDeleted: 1 }).lean().exec();

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        if (address.isDeleted) {
            throw new ConflictException('Address already deleted');
        }


        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && address.user.toString() !== authorId) {
            throw new ForbiddenException();
        }

        await this.Address.updateOne({ _id: addressId }, { isDeleted: true }).exec();
    }

    async recoverAddress(addressId: string) {
        const address = await this.Address.updateOne({ _id: addressId }, { isDeleted: false, isDefault: false })

        if(!address){
            throw new NotFoundException('Address not found');
        }
    }



}