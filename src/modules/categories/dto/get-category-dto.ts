import { IsOptional, IsString } from "class-validator";




export class CategoryQueryDto {
    @IsOptional()
    @IsString()
    page: string

    @IsOptional()
    @IsString()
    search: string
}