import { ArrayNotEmpty, IsArray, IsDateString, isDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostStatusEnum } from '../schema/post.schema';

// Enum defining what satatus a new post can have
// Users cannot explicitly create post with awaiting approval or rejected status
// Those details are handled by us on backend

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    previewImageKey?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsMongoId({ each: true, message: "Invalid Id in categories array" })
    @ArrayNotEmpty()
    categories: string[];

    @IsEnum(PostStatusEnum)
    @IsNotEmpty()
    status?: PostStatusEnum = PostStatusEnum.DRAFT;

    @IsDateString()
    @IsOptional()
    publishedDate?: string = (new Date).toISOString();
}