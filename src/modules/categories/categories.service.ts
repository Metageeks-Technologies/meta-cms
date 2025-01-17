import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private Category: Model<ICategory>,
    private readonly redisService: RedisService
  ) { }

  async create(newCategoryData: CreateCategoryDto) {
    const newCategory = new this.Category(newCategoryData);
    
    try {
      await newCategory.save();
    } catch(error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Category Name already exists');
      }
      
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async findAll() {
    // Using lean for efficiency
    // since categories will be fetched quite often

    // get categories from cache 
    const categoriesData = await this.redisService.getCache('allCategory');
    if(categoriesData){
      return JSON.parse(categoriesData);
    }
    
    const categories = await this.Category.find().sort({ createdAt: -1 }).lean().exec();

    // stored categories from cache 
    await this.redisService.setCache('allCategory', JSON.stringify(categories));
    return categories as ICategory[];
  }

  async findById(_id: string) {
    const category = await this.Category.findOne({_id: _id}).lean().exec();
    if(!category) {
      throw new NotFoundException("Category not found");
    }
    return category as ICategory;
  }

  async updateById(_id: string, updatedCategoryData: UpdateCategoryDto) {
    try {
      const query = await this.Category.updateOne( { _id : _id }, { $set: updatedCategoryData } ).exec();
      if(query.matchedCount == 0) {
        throw new NotFoundException("Category ID not found");
      }
    } catch(error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Category Name already exists');
      }
      
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async deleteById(_id: string) {
    const query = await this.Category.deleteOne( { _id: _id }).exec(); 
    if(query.deletedCount == 0) {
      throw new NotFoundException('Category Id not found');
    }
  }
}
