import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateOrderDto } from "./dto/create-order-dto";




@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Req() req: Request, @Body() newOrder: CreateOrderDto) {
        const user = (req as any).user
        await this.orderService.createOrder(user._id, user.storeRole, newOrder);
        return {message: "Order Placed"}
    }

}