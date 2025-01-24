import { Type } from "class-transformer";
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductStatusEnum } from "../schema/product.schema";


export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    subDescription: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsMongoId({ message: "Invalid Id in category" })
    @IsNotEmpty()
    category: string

    @IsString()
    @IsOptional()
    brand?: string

    @IsEnum(ProductStatusEnum)
    @IsNotEmpty()
    status: ProductStatusEnum

    @IsOptional()
    @IsObject({ message: 'Attributes must be an object' })
    attributes?: Record<string, string>;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants: CreateVariantDto[];
}

export class CreateVariantDto {

    @IsString()
    @IsNotEmpty()
    variantId: string;

    @IsString()
    @IsOptional()
    sku: string; // Unique identifier for the variant

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsOptional()
    discountedPrice?: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    size?: string;

    @IsString()
    @IsOptional()
    color?: string;   

    @IsArray()
    @IsOptional()
    imageKeys?: string[]; // Variant-specific images
}


