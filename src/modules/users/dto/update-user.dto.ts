import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, Length, MaxLength, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { SocialLinksDto } from "./create-user.dto";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    imageKey?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsNumberString()
    @Length(10, 10, { message: 'Phone number must be exactly 10 characters' })
    phoneNo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @Type(() => SocialLinksDto)
    @ValidateNested()
    @IsOptional()
    socialLinks?: SocialLinksDto;
}