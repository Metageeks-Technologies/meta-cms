import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateOrderDto, CreateOrderWithoutPayDto } from "./dto/create-order-dto";
import { AllowedRoles, AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { StoreRolesGuard } from "src/modules/auth/role.guard";
import { UpdateStatusDto } from "./dto/update-status-dto";
import { GetOrderQuery } from "./dto/get-order-dto";




@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Req() req: Request, @Body() newOrder: CreateOrderWithoutPayDto) {
        const user = (req as any).user
        await this.orderService.createOrder(user._id, user.storeRole, newOrder);
        return { message: "Order Placed" }
    }

    @Post('initiate-payment')
    @UseGuards(AuthGuard)
    async createPayment(@Req() req: Request) {
        const user = (req as any).user;
        const order = await this.orderService.initiatePayment(user._id)
        return order;
    }

    @Post('verify-create-order')
    @UseGuards(AuthGuard)
    async verifyPaymentAndCreateOrder(@Req() req: Request, @Body() newOrder: CreateOrderDto) {
        const user = (req as any).user;
        await this.orderService.verifyAndCreateOrder(user._id, user.storeRole, newOrder)
        return { message: "Order Placed" }
    }

    @Get('my')
    @UseGuards(AuthGuard)
    async getMyOrder(@Req() req: Request, @Query() query: GetOrderQuery) {
        const user = (req as any).user;
        const orders = await this.orderService.getUserOrders(user._id, query);
        return orders;
    }

    @Patch('my/cancel/:id')
    @UseGuards(AuthGuard)
    async cancelMyOrder(@Req() req: Request, @Param('id', ValidateId) orderId: string) {
        const user = (req as any).user;
        await this.orderService.cancelOrder(orderId, user._id, undefined)
        return { message: "Order cancelled" }
    }

    @Get('vendor')
    @UseGuards(AuthGuard)
    async getVendorOrder(@Req() req: Request, @Query() query: GetOrderQuery) {
        const user = (req as any).user;
        const order = await this.orderService.getVendorOrders(user._id, query);
        return order;
    }

    @Patch('vendor/cancel/:id')
    @UseGuards(AuthGuard)
    async cancelOrder(@Req() req: Request, @Param('id', ValidateId) orderId: string) {
        const user = (req as any).user;
        await this.orderService.cancelOrder(orderId, undefined, user._id)
        return { message: "Order cancelled" }
    }

    @Patch('vendor/update-status/:id')
    @UseGuards(AuthGuard)
    async changeOrderStatus(@Req() req: Request, @Param('id', ValidateId) orderId: string, @Body() newStatus: UpdateStatusDto) {
        const user = (req as any).user;
        await this.orderService.changeOrderStatus(orderId, user._id, newStatus.status);
        return { message: "Status updated" }
    }

    @Get('all')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getAllOrder(@Query() query: GetOrderQuery) {
        const order = this.orderService.getAllOrders(query);
        return order
    }

    @Get(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getUserAllOrder(@Param('id', ValidateId) userId: string, @Query() query: GetOrderQuery) {
        const orders = this.orderService.getUserOrders(userId, query);
        return orders;
    }

}