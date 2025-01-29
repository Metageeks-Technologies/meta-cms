import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IOrder, OrderStatusEnum } from "./schema/order.schema";
import { ProductService } from "../product/product.service";
import { CartService } from "../cart/cart.service";
import { UsersService } from "src/modules/users/users.service";
import { CreateOrderDto } from "./dto/create-order-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { GetOrderQuery } from "./dto/get-order-dto";




@Injectable()
export class OrderService {

    constructor(
        @InjectModel('Order') private readonly Order: Model<IOrder>,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly userService: UsersService
    ) { }


    async createOrder(userId: string, userStoreRole: UserStoreRoleEnum, newOrderDetails: CreateOrderDto) {
        const { cartId, addressId } = newOrderDetails;

        const cart = await this.cartService.getCart(userId);

        if (!cart || !cart.items.length) {
            throw new BadRequestException('Cart is empty!');
        }

        // console.log("Cart",cart)

        const vendorMap = new Map();

        for (const item of cart.items) {
            const vendorId = item.product.vendor;
            if (!vendorMap.has(vendorId)) {
                vendorMap.set(vendorId, []);
            }
            vendorMap.get(vendorId).push(item);
        }

        for (const [vendorId, items] of vendorMap) {

            let totalPrice = 0;

            items.forEach((item: any) => {
                // console.log(item.product.variants, "Variants")
                item.product.variants.forEach((variant: any) => {
                    if (variant.variantId === item.variantId) {
                        if (variant.discountedPrice) {
                            totalPrice += variant.discountedPrice
                            return
                        }
                        totalPrice += variant.price;
                    }
                })
            });

            await this.Order.create({
                user: userId,
                vendor: vendorId,
                items: items,
                shippingAddress: addressId,
                totalAmount: totalPrice,
            });
            //   orders.push(order);
        }

        await this.cartService.clearCart(userId, userStoreRole);
    }


    async getOrders(userId: string, vendorId: string, status: OrderStatusEnum, lastId: string) {
        const query = {}

        if (userId) {
            query['user'] = userId
        }

        if (vendorId) {
            query['vendor'] = vendorId
        }

        if (status) {
            query['shippingStatus'] = status
        }

        if (lastId) {
            query['_id'] = { $lt: lastId };
        }

        const orders = this.Order.find(query)
            .sort({ _id: -1 })
            .limit(10)
            .populate({
                path: "user",
                select: "_id name email phone bio"
            }).populate({
                path: "vendor",
                select: "_id name email phone bio"
            }).populate({
                path: "items",
                populate: {
                    path: "product",
                    populate: {
                        path: "category"
                    }
                }
            }).populate('shippingAddress')


        return orders;
    }

    async getUserOrders(userId: string, query: GetOrderQuery) {
        const orders = await this.getOrders(userId, undefined, query.status, query.lastId)
        return orders;
    }

    async getVendorOrders(vendorId: string, query: GetOrderQuery) {
        const orders = await this.getOrders(undefined, vendorId, query.status, query.lastId)
        return orders;
    }

    async updateOrderStatus(query: any, newStatus: OrderStatusEnum) {
        const order = await this.Order.findOneAndUpdate(query, { shippingStatus: newStatus })

        if (!order) {
            throw new NotFoundException('Order not found')
        }
    }

    async cancelOrder(orderId: string, userId: string, vendorId: string) {
        const query = {
            _id: orderId,
            shippingStatus: OrderStatusEnum.PENDING
        }

        if (userId) {
            query['user'] = userId;
        }

        if (vendorId) {
            query['vendor'] = vendorId;
        }

        await this.updateOrderStatus(query, OrderStatusEnum.CANCELLED);
    }

    async changeOrderStatus(orderId: string, vendorId: string, newStatus: OrderStatusEnum) {
        const query = {
            _id: orderId,
            vendor: vendorId
        }
        // console.log(query, "Ouery")
        await this.updateOrderStatus(query, newStatus);
    }

}