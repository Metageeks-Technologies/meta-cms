import { IsNotEmpty, IsString, Matches } from "class-validator";



export class AddWebSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z0-9_-]+$/, {
        message: 'Key must contain only lowercase letters, numbers, hyphens (-), and underscores (_), with no spaces or special characters.',
    })
    key: string;
}