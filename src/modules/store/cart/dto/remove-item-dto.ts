import { IsMongoId, IsNotEmpty, IsString } from "class-validator";



export class RemoveItemDto {
    
    @IsMongoId()
    @IsNotEmpty()
    productId: string

    @IsNotEmpty()
    @IsString()
    variantId: string
}