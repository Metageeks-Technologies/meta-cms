import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { PaymentTypeEnum } from "../schema/order.schema";



export class CreateOrderDto {
    @IsMongoId()
    @IsNotEmpty()
    cartId: string;


    @IsMongoId()
    @IsNotEmpty()
    addressId: string;

    @IsNotEmpty()
    @IsString()
    razorpay_order_id: string;

    @IsNotEmpty()
    @IsString()
    razorpay_payment_id: string;

    @IsNotEmpty()
    @IsString()
    razorpay_signature: string;

    @IsNotEmpty()
    @IsEnum(PaymentTypeEnum)
    payment_type: PaymentTypeEnum
}

export class CreateOrderWithoutPayDto {
    @IsMongoId()
    @IsNotEmpty()
    cartId: string;


    @IsMongoId()
    @IsNotEmpty()
    addressId: string;
}