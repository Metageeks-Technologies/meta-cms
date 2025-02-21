import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUnit } from "./schema/unit.schema";
import { CreateUnitDto } from "./dto/create-unit-dto";
import { UpdateUnitDto } from "./dto/update-unit-dto";
import { RedisService } from "src/modules/redis/redis.service";
import { RedisKeys } from "src/utils/constant";
import { WebsiteService } from "src/modules/website/website.service";




@Injectable()
export class UnitService {
    constructor(
        @InjectModel('Unit') private Unit: Model<IUnit>,
        private readonly redisService: RedisService,
        private readonly websiteService: WebsiteService
    ) { }


    async create(websiteKey: string, unitDetails: CreateUnitDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const newUnit = new this.Unit({ ...unitDetails, websiteKey });

        try {
            // await this.redisService.deleteCache(RedisKeys.AllUnits)
            await newUnit.save();
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Unit Name already exists');
            }

            // Re-throw the error if it's not a duplicate key error
            throw error;
        }
    }

    async updateById(websiteKey: string, unitId: string, unitDetails: UpdateUnitDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        try {
            const query = await this.Unit.updateOne({ _id: unitId, websiteKey }, { $set: unitDetails }).exec();
            if (query.matchedCount == 0) {
                throw new NotFoundException("Unit ID not found");
            }

        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Unit Name already exists');
            }

            // Re-throw the error if it's not a duplicate key error
            throw error;
        }
    }

    async getAll(websiteKey: string, isDeleted?: boolean) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = { websiteKey };

        if (isDeleted !== undefined) {
            query['isDeleted'] = isDeleted
        }
        const units = await this.Unit.find(query).lean().exec();
        return units;
    }

    async deleteUnit(websiteKey: string, unitId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const unit = await this.Unit.findOne({ _id: unitId, websiteKey }, { isDeleted: 1 }).exec();

        if (!unit) {
            throw new NotFoundException('Unit not found')
        }

        if (unit.isDeleted) {
            throw new BadRequestException('Unit already deleted');
        }

        await this.Unit.updateOne({ _id: unitId }, { isDeleted: true }).lean().exec();
    }

    async recoverUnit(websiteKey: string, unitId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if(!website){
            throw new BadRequestException('Invalid website key')
        }

        const query = await this.Unit.updateOne({ _id: unitId, websiteKey }, { isDeleted: false }).lean().exec();

        if (query.matchedCount == 0) {
            throw new NotFoundException("Unit ID not found");
        }

    }

}