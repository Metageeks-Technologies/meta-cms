import { IsNotEmpty, IsString, Matches } from "class-validator";


export class CreatePageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @Matches(/^[a-z0-9-_/]+$/, { message: 'Invalid Slug' })
    slug: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}