import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from 'src/utils/constant';
import { WebsiteService } from '../website/website.service';

@Injectable()
export class CategoriesService {
    private readonly CATEGORY_PAGE_BATCH_LIMIT = 10;

    constructor(
        @InjectModel('Category') private Category: Model<ICategory>,
        private readonly redisService: RedisService,
        private readonly websiteService: WebsiteService,
    ) { }

    async create(websiteKey: string, newCategoryData: CreateCategoryDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        const newCategory = new this.Category(newCategoryData);
        newCategory.name = newCategory.name.replace(/^\w/, (c) =>
            c.toUpperCase(),
        );
        newCategory.websiteKey = websiteKey;

        try {
            // Delete all Category cache
            await this.redisService.deleteCache(RedisKeys.AllCategory);

            await newCategory.save();
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Category Name already exists');
            }

            // Re-throw the error if it's not a duplicate key error
            throw error;
        }
    }

    async findAll(websiteKey: string, pageNo: string, searchQuery: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        const query = { websiteKey }
        let sortOption: any = { createdAt: -1 }

        const page = parseInt(pageNo) || 1;
        const skip = (page - 1) * this.CATEGORY_PAGE_BATCH_LIMIT;

        if (searchQuery) {
            query['$text'] = { $search: searchQuery }
            sortOption = { score: { $meta: "textScore" }, createdAt: -1 }
        }

        const categories = await this.Category.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(this.CATEGORY_PAGE_BATCH_LIMIT)
            .select(searchQuery && { score: { $meta: "textScore" } })
            .lean()
            .exec();

        // stored categories in cache
        // this.redisService.setCache(RedisKeys.AllCategory, JSON.stringify(categories));
        return categories as ICategory[];
    }

    async findById(websiteKey: string, _id: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        // get category by id from cache
        // const categoryData = await this.redisService.getCache(`${RedisKeys.CategoryId}_${_id}`);
        // if (categoryData) {
        //   return JSON.parse(categoryData);
        // }

        const category = await this.Category.findOne({
            _id: _id,
            websiteKey: websiteKey,
        })
            .lean()
            .exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // stored categories in cache
        // this.redisService.setCache(`${RedisKeys.CategoryId}_${_id}`, JSON.stringify(category));
        return category as ICategory;
    }

    async updateById(
        websiteKey: string,
        _id: string,
        updatedCategoryData: UpdateCategoryDto,
    ) {
        try {
            const website =
                await this.websiteService.getWebsiteByKey(websiteKey);
            if (!website) {
                throw new BadRequestException('Invalid website key');
            }

            const query = await this.Category.updateOne(
                { _id: _id, websiteKey: websiteKey },
                { $set: updatedCategoryData },
            ).exec();
            if (query.matchedCount == 0) {
                throw new NotFoundException('Category ID not found');
            }

            // Delete all Category cache
            // await this.redisService.deleteCache(RedisKeys.AllCategory);
            // Delete Category by id
            // await this.redisService.deleteCache(`${RedisKeys.CategoryId}_${_id}`);
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Category Name already exists');
            }

            // Re-throw the error if it's not a duplicate key error
            throw error;
        }
    }

    async deleteById(websiteKey: string, _id: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        const query = await this.Category.deleteOne({
            _id: _id,
            websiteKey: websiteKey,
        }).exec();
        if (query.deletedCount == 0) {
            throw new NotFoundException('Category Id not found');
        }

        // Delete all Category cache
        // await this.redisService.deleteCache(RedisKeys.AllCategory);
        // Delete Category by id
        // await this.redisService.deleteCache(`${RedisKeys.CategoryId}_${_id}`);
    }
}
