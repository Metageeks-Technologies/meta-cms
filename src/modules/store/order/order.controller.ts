import { Body, Controller, Get, Headers, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateOrderDto, CreateOrderWithoutPayDto } from "./dto/create-order-dto";
import { AllowedRoles, AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum, UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { RolesGuard, StoreRolesGuard } from "src/modules/auth/role.guard";
import { UpdateStatusDto } from "./dto/update-status-dto";
import { GetOrderQuery } from "./dto/get-order-dto";




@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Body() newOrder: CreateOrderWithoutPayDto
    ) {
        const user = (req as any).user
        await this.orderService.createOrder(websiteKey, user._id, user.role, newOrder);
        return { message: "Order Placed" }
    }

    @Post('initiate-payment')
    @UseGuards(AuthGuard)
    async createPayment(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
        const user = (req as any).user;
        const order = await this.orderService.initiatePayment(websiteKey, user._id)
        return order;
    }

    @Post('verify-create-order')
    @UseGuards(AuthGuard)
    async verifyPaymentAndCreateOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Body() newOrder: CreateOrderDto
    ) {
        const user = (req as any).user;
        await this.orderService.verifyAndCreateOrder(websiteKey, user._id, user.storeRole, newOrder)
        return { message: "Order Placed" }
    }

    @Get('my')
    @UseGuards(AuthGuard)
    async getMyOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Query() query: GetOrderQuery
    ) {
        const user = (req as any).user;
        const orders = await this.orderService.getUserOrders(websiteKey, user._id, query);
        return orders;
    }

    @Patch('my/cancel/:id')
    @UseGuards(AuthGuard)
    async cancelMyOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) orderId: string
    ) {
        const user = (req as any).user;
        await this.orderService.cancelOrder(websiteKey, orderId, user._id, undefined)
        return { message: "Order cancelled" }
    }

    @Get('vendor')
    @UseGuards(AuthGuard)
    async getVendorOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Query() query: GetOrderQuery
    ) {
        const user = (req as any).user;
        const order = await this.orderService.getVendorOrders(websiteKey, user._id, query);
        return order;
    }

    @Patch('vendor/cancel/:id')
    @UseGuards(AuthGuard)
    async cancelOrder(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) orderId: string
    ) {
        const user = (req as any).user;
        await this.orderService.cancelOrder(websiteKey, orderId, undefined, user._id)
        return { message: "Order cancelled" }
    }

    @Patch('vendor/update-status/:id')
    @UseGuards(AuthGuard)
    async changeOrderStatus(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) orderId: string,
        @Body() newStatus: UpdateStatusDto
    ) {
        const user = (req as any).user;
        await this.orderService.changeOrderStatus(websiteKey, orderId, user._id, newStatus.status);
        return { message: "Status updated" }
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllOrder(@Headers('websiteKey') websiteKey: string, @Query() query: GetOrderQuery) {
        const order = this.orderService.getAllOrders(websiteKey, query);
        return order
    }

    @Get(':id')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getUserAllOrder(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) userId: string,
        @Query() query: GetOrderQuery
    ) {
        const orders = this.orderService.getUserOrders(websiteKey, userId, query);
        return orders;
    }

}