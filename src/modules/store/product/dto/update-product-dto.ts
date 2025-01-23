import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto, CreateVariantDto } from "./create-product-dto";
import { IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ProductStatusEnum } from "../schema/product.schema";



export class UpdateProductDto {
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
}

export class UpdateVariantDto extends PartialType(CreateVariantDto) { }