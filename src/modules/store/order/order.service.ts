import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IOrder } from "./schema/order.schema";
import { ProductService } from "../product/product.service";
import { CartService } from "../cart/cart.service";
import { UsersService } from "src/modules/users/users.service";
import { CreateOrderDto } from "./dto/create-order-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { query } from "express";




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


        // const orders = [];

        for (const [vendorId, items] of vendorMap) {

            let totalPrice = 0;

            items.forEach((item: any) => {
                // console.log(item.product.variants, "Variants")
                item.product.variants.forEach((variant: any) => {
                    if(variant.variantId === item.variantId){
                        if(variant.discountedPrice){
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


    async getOrders(userId: string, vendorId: string){
        const query = {}

        if(userId){
            query['user'] = userId
        }

        if(vendorId){
            query['vendor'] = vendorId
        }

        // const result = this.Order.find(query).

        // const orders = result[0];
    }



}