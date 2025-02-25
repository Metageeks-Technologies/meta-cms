import { IsArray, IsOptional, IsString } from "class-validator";



export class UpdateWebsiteDto {
    @IsOptional()
    @IsString()
    name: string

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    permissions: string[]
}