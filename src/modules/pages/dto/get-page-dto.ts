import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";





export class GetPageQueryDto {
    @IsOptional()
    @IsString()
    website: string

    @IsOptional()
    @IsString()
    page: string
}