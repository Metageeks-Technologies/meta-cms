import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"



export class UpdateQuantityDto {
    @IsNotEmpty()
    @IsMongoId()
    productId: string;

    @IsNotEmpty()
    @IsString()
    variantId: string;
    
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

}