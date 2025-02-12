import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";
import { PermissionEnum } from "../schema/website.schema";



export class AddWebSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsArray()
    @ArrayNotEmpty() 
    @IsString({ each: true })
    permissions: string[]

}