import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../../users/users.module';
import { RedisModule } from '../../redis/redis.module';
import { ProductCategorySchema } from './schema/productCategory.schema';
import { ProductCategoriesController } from './productCategories.controller';
import { ProductCategoriesService } from './productCategories.service';
import { WebsiteModule } from 'src/modules/website/website.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ProductCategory', schema: ProductCategorySchema }]),
    UsersModule,
    RedisModule,
    WebsiteModule
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService]
})
export class ProductCategoriesModule {}
