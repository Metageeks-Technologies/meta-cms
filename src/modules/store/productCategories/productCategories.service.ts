import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../../redis/redis.service';
import { RedisKeys } from 'src/utils/constant';
import { IProductCategory } from './schema/productCategory.schema';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { WebsiteService } from 'src/modules/website/website.service';

@Injectable()
export class ProductCategoriesService {

  private readonly PRODUCT_CATEGORY_PAGE_BATCH_LIMIT = 10;

  constructor(
    @InjectModel('ProductCategory') private ProductCategory: Model<IProductCategory>,
    private readonly redisService: RedisService,
    private readonly websiteService: WebsiteService
  ) { }

  async create(websiteKey: string, newCategoryData: CreateProductCategoryDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey)
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const newCategory = new this.ProductCategory({ ...newCategoryData, websiteKey });

    try {
      // Delete all Category cache
      await this.redisService.deleteCache(RedisKeys.AllProductCategory);

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
    const website = await this.websiteService.getWebsiteByKey(websiteKey)
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }
    // Using lean for efficiency
    // since categories will be fetched quite often

    // get categories from cache 
    // const categoriesData = await this.redisService.getCache(RedisKeys.AllProductCategory);
    // if (categoriesData) {
    //   return JSON.parse(categoriesData);
    // }

    const query = { websiteKey }
    let sortOption: any = { createdAt: -1 }

    if (searchQuery) {
      query['$text'] = { $search: searchQuery }
      sortOption = { score: { $meta: "textScore" }, createdAt: -1 }
    }


    if (pageNo) {
      const page = parseInt(pageNo) || 1
      const skip = (page - 1) * this.PRODUCT_CATEGORY_PAGE_BATCH_LIMIT

      const categories = await this.ProductCategory.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(this.PRODUCT_CATEGORY_PAGE_BATCH_LIMIT)
        .select(searchQuery && { socre: { $meta: "textScore" } })
        .lean().exec();


      // stored categories in cache 
      // this.redisService.setCache(RedisKeys.AllProductCategory, JSON.stringify(categories));


      return categories as IProductCategory[];

    } else {
      const categories = await this.ProductCategory.find({ websiteKey }).sort({ createdAt: -1 }).lean().exec();
      return categories as IProductCategory[];

    }
  }

  async findById(websiteKey: string, _id: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey)
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    // get category by id from cache
    const categoryData = await this.redisService.getCache(`${RedisKeys.ProductCategoryId}_${_id}`);
    if (categoryData) {
      return JSON.parse(categoryData);
    }

    const category = await this.ProductCategory.findOne({ _id: _id, websiteKey }).lean().exec();
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // stored categories in cache
    this.redisService.setCache(`${RedisKeys.ProductCategoryId}_${_id}`, JSON.stringify(category));
    return category as IProductCategory;
  }

  async updateById(websiteKey: string, _id: string, updatedCategoryData: UpdateProductCategoryDto) {
    try {
      const website = await this.websiteService.getWebsiteByKey(websiteKey)
      if (!website) {
        throw new BadRequestException('Invalid website key')
      }

      const query = await this.ProductCategory.updateOne({ _id: _id, websiteKey }, { $set: updatedCategoryData }).exec();
      if (query.matchedCount == 0) {
        throw new NotFoundException("Category ID not found");
      }

      // Delete all Category cache
      await this.redisService.deleteCache(RedisKeys.AllProductCategory);
      // Delete Category by id
      await this.redisService.deleteCache(`${RedisKeys.ProductCategoryId}_${_id}`);
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
    const website = await this.websiteService.getWebsiteByKey(websiteKey)
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const query = await this.ProductCategory.deleteOne({ _id: _id, websiteKey }).exec();
    if (query.deletedCount == 0) {
      throw new NotFoundException('Category Id not found');
    }

    // Delete all Category cache
    await this.redisService.deleteCache(RedisKeys.AllProductCategory);
    // Delete Category by id
    await this.redisService.deleteCache(`${RedisKeys.ProductCategoryId}_${_id}`);
  }
}
