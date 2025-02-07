import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";



export class AddWebSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsArray()
    @ArrayNotEmpty() 
    @IsString({ each: true })
    premissions: string[]

}