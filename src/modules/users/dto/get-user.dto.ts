import { IsOptional, IsString } from "class-validator";





export class UserQueryDto {
    @IsOptional()
    @IsString()
    page: string
    


    @IsOptional()
    @IsString()
    search: string
}