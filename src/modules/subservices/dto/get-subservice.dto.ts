import { IsOptional, IsString } from "class-validator";




export class SubServiceQueryDto {
    @IsOptional()
    @IsString()
    page: string

    @IsOptional()
    @IsString()
    search: string
}