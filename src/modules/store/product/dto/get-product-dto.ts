import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductStatusEnum } from "../schema/product.schema";
import { Transform, Type } from "class-transformer";


export enum ProductSortByEnum {
    TRENDING = 'trending',
    POPULAR = 'popular',
    RECENT = 'recent',
    OLDEST = 'oldest',
  };
  

  export class GetProductQueryDto {
    // Status query param and isDeleted query param will be ignored in GET /posts/public route
    @IsOptional()
    @IsEnum(ProductStatusEnum)
    status?: ProductStatusEnum;
  
    // use transform for convert string isDeleted query to right boolean value
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
      }
      return value;
    })
    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
  
    @IsOptional()
    @IsMongoId()
    userId?: string;
  
    @IsOptional()
    @IsString()
    @IsMongoId({ message: "Invalid Id of category" })
    categoryId?: string;
  
    @IsOptional()
    @IsEnum(ProductSortByEnum)
    sortBy?: ProductSortByEnum = ProductSortByEnum.RECENT;
  
    @IsOptional()
    @IsMongoId()
    lastId?: string;
  
    @IsString()
    @IsOptional()
    searchQuery?: string
  }
  