import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IOrder, OrderStatusEnum, PaymentStatusEnum, PaymentTypeEnum } from "./schema/order.schema";
import { ProductService } from "../product/product.service";
import { CartService } from "../cart/cart.service";
import { UsersService } from "src/modules/users/users.service";
import { CreateOrderDto, CreateOrderWithoutPayDto } from "./dto/create-order-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { GetOrderQuery } from "./dto/get-order-dto";
import { PaymentService } from "../payment/payment.service";




@Injectable()
export class OrderService {

    constructor(
        @InjectModel('Order') private readonly Order: Model<IOrder>,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly userService: UsersService,
        private readonly paymentService: PaymentService
    ) { }


    async createOrder(userId: string, userStoreRole: UserStoreRoleEnum, newOrderDetails: CreateOrderWithoutPayDto) {
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
                            totalPrice += variant.discountedPrice * item.quantity
                            return
                        }
                        totalPrice += variant.price * item.quantity;
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

        // await this.cartService.clearCart(userId, userStoreRole);
    }


    async initiatePayment(userId: string) {

        // Get cart details
        const cart = await this.cartService.getCart(userId);

        if (!cart || !cart.items.length) {
            throw new BadRequestException('Cart is empty!');
        }

        // Calculate total amount
        let totalAmount = 0;
        cart.items.forEach((item: any) => {
            // console.log(item.product.variants, "Variants")
            item.product.variants.forEach((variant: any) => {
                if (variant.variantId === item.variantId) {
                    if (variant.discountedPrice) {
                        totalAmount += variant.discountedPrice * item.quantity
                        return
                    }
                    totalAmount += variant.price * item.quantity;
                }
            })
        });

        const order = await this.paymentService.createOrder(totalAmount);

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        };
    }


    async verifyAndCreateOrder(
        userId: string,
        userStoreRole: UserStoreRoleEnum,
        newOrderDetails: CreateOrderDto,
    ) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_type } = newOrderDetails;

        const isPaymentValid = await this.paymentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isPaymentValid.success) {
            throw new BadRequestException('Payment verification failed');
        }

        const { addressId } = newOrderDetails;
        const cart = await this.cartService.getCart(userId);

        if (!cart || !cart.items.length) {
            throw new BadRequestException('Cart is empty!');
        }

        // Map items by vendor
        const vendorMap = new Map();
        for (const item of cart.items) {
            const vendorId = item.product.vendor;
            if (!vendorMap.has(vendorId)) {
                vendorMap.set(vendorId, []);
            }
            vendorMap.get(vendorId).push(item);
        }

        // Create orders for each vendor
        for (const [vendorId, items] of vendorMap) {
            let totalPrice = 0;

            items.forEach((item: any) => {
                // console.log(item.product.variants, "Variants")
                item.product.variants.forEach((variant: any) => {
                    if (variant.variantId === item.variantId) {
                        if (variant.discountedPrice) {
                            totalPrice += variant.discountedPrice * item.quantity
                            return
                        }
                        totalPrice += variant.price * item.quantity;
                    }
                })
            });

            await this.Order.create({
                user: userId,
                vendor: vendorId,
                items: items,
                totalAmount: totalPrice,
                shippingAddress: addressId,
                paymentStatus: PaymentStatusEnum.PAID,
                paymentType: payment_type,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
            });
        }

        // Clear cart after successful order creation
        await this.cartService.clearCart(userId, userStoreRole);

        return { success: true, message: 'Order created successfully' };
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