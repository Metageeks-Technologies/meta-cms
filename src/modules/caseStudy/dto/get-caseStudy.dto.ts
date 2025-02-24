import { IsOptional, IsString } from "class-validator";




export class CaseStudyQueryDto {
    @IsOptional()
    @IsString()
    page: string;

    @IsOptional()
    @IsString()
    search: string;
}