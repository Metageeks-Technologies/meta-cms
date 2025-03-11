import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEmail, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, IsUrl, Length, MaxLength, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { UserRoleEnum } from "../schema/user.schema";

export class SocialLinksDto {
    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: "Linked In must be a valid URL" })
    linkedIn?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: "Instagram must be a valid URL" })
    instagram?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: "Facebook must be a valid URL" })
    facebook?: string;

    @ValidateIf((object, value) => value !== '')
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: "Twitter must be a valid URL" })
    twitter?: string;
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(UserRoleEnum)
    @IsOptional()
    role: UserRoleEnum

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

    @IsOptional()
    @IsString()
    websiteName?: string;

    @IsOptional()
    @IsString()
    domain?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    permissions: string[]

}

