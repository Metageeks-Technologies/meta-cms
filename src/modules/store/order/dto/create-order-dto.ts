import { IsMongoId, IsNotEmpty } from "class-validator"



export class CreateOrderDto {
    @IsMongoId()
    @IsNotEmpty()
    cartId: string; 
    
    
    @IsMongoId()
    @IsNotEmpty()
    addressId: string;
}