import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { OrderStatusEnum } from "../schema/order.schema";


export class GetOrderQuery {
    @IsEnum(OrderStatusEnum)
    @IsOptional()
    status: OrderStatusEnum

    @IsOptional()
    @IsString()
    page: string
}