import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatusEnum } from "../schema/order.schema";


export class UpdateStatusDto {

    @IsEnum(OrderStatusEnum)
    @IsNotEmpty()
    status: OrderStatusEnum;
}