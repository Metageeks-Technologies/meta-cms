import { IsEnum, IsOptional, IsString, IsBoolean, IsArray, IsNumber, IsMongoId } from 'class-validator';
import { Transform, TransformPlainToInstance, Type } from 'class-transformer';
import { PostStatusEnum } from '../schema/post.schema';

export enum PostSortByEnum {
    TRENDING = 'trending',
    POPULAR = 'popular',
    RECENT = 'recent',
    OLDEST = 'oldest',
};

export class GetPostsQueryDto {
  // Status query param will be ignored in GET /posts/public route
  @IsOptional()
  @IsEnum(PostStatusEnum)
  status?: PostStatusEnum;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @Transform( ({ value }) => ( 
    Array.isArray(value) ? 
      value : 
      (value ? [value] : value)
  ))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Transform( ({ value }) => ( 
    Array.isArray(value) ? 
      value : 
      (value ? [value] : value)
  ))
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: "Invalid Id in categories array" })
  categories?: string[];

  @IsOptional()
  @IsEnum(PostSortByEnum)
  sortBy?: PostSortByEnum = PostSortByEnum.RECENT;

  @IsOptional()
  @IsMongoId()
  lastId?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  lastLikesCount?: number;
}
