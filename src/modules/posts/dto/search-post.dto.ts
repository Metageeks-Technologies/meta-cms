import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { WebsiteEnum } from "../schema/post.schema";

export enum SearchPostSortByEnum {
    RELEVANCY = 'relevancy',
    RECENT = 'recent'
}

export class SearchPostsQueryDto {
    @IsString()
    @IsNotEmpty()
    query: string

    @IsOptional()
    @IsEnum(SearchPostSortByEnum)
    sortBy?: SearchPostSortByEnum = SearchPostSortByEnum.RELEVANCY;

    @IsOptional()
    @IsMongoId()
    lastId?: string;
  
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    lastScore?: number;

    @IsEnum(WebsiteEnum)
    @IsNotEmpty()
    website: WebsiteEnum;
}