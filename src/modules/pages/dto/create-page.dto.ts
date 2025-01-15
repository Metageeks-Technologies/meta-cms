import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";


export class CreatePageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @Matches(/^[a-z0-9-_/]+$/, { message: 'Invalid Slug' })
    @MaxLength(128)
    slug: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}