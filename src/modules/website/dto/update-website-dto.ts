import { PartialType } from "@nestjs/mapped-types";
import { AddWebSiteDto } from "./create-website-dto";
import { IsOptional, IsString } from "class-validator";



export class UpdateWebsiteDto {
    @IsOptional()
    @IsString()
    name: string
}