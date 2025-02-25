import { IsOptional, IsString } from "class-validator";




export class ProductCategoryQueryDto {
    @IsOptional()
    @IsString()
    page: string

    @IsOptional()
    @IsString()
    search: string
}