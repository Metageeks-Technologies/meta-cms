import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, IsUrl, Length, MaxLength, MinLength, ValidateIf, ValidateNested } from "class-validator";

export class SocialLinksDto {
    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl()
    linkedIn?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl()
    instagram?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl()
    facebook?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl()
    twitter?: string;
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password should be atleast 8 characters long" })
    @IsStrongPassword({
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: "Password must contain atleast one lowercase letter, one uppercase letter, one digit and one special character" })
    password: string;

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

