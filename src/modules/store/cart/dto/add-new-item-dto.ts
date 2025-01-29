import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddNewItemInCartDto {
    @IsNotEmpty()
    @IsMongoId()
    product: string;

    @IsNotEmpty()
    @IsString()
    variantId: string;

    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}