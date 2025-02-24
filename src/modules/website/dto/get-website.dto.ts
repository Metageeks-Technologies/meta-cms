import { IsOptional, IsString } from "class-validator";




export class WebsiteQueryDto {
    @IsOptional()
    @IsString()
    page: string;

    @IsOptional()
    @IsString()
    search: string;
}