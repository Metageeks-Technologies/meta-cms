import { IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString } from "class-validator"


export class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    house: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    landmark: string;

    @IsNumber(undefined, { message: 'Postal code must be a number' })
    @IsNotEmpty()
    postalCode: number;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsOptional()
    instruction?: string;

    @IsBoolean()
    @IsOptional()
    isDefault: boolean;
}
