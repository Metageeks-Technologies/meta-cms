import { IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"


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
    @Min(100000, { message: 'Postal code must have at least 6 digits' })
    @Max(999999, { message: 'Postal code must have at most 6 digits' }) 
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
