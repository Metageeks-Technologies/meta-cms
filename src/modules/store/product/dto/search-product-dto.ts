import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum SearchProductSortByEnum {
    RELEVANCY = 'relevancy',
    RECENT = 'recent'
}

export class SearchProductQueryDto {
    @IsString()
    @IsNotEmpty()
    query: string

    @IsOptional()
    @IsEnum(SearchProductSortByEnum)
    sortBy?: SearchProductSortByEnum = SearchProductSortByEnum.RELEVANCY;

    @IsOptional()
    @IsMongoId()
    lastId?: string;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    lastScore?: number;
}