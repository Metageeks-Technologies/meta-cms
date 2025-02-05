import { IsNotEmpty, IsString } from "class-validator";





export class GetPageQueryDto {
    @IsNotEmpty()
    @IsString()
    website: string
}