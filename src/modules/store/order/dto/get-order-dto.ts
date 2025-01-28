import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { OrderStatusEnum } from "../schema/order.schema";


export class GetOrderQuery {
    @IsEnum(OrderStatusEnum)
    @IsOptional()
    status: OrderStatusEnum

    @IsMongoId()
    @IsOptional()
    lastId: string
}