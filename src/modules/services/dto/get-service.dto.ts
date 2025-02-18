import { IsOptional, IsString } from "class-validator";




export class ServiceQueryDto {
    @IsOptional()
    @IsString()
    page: string
}