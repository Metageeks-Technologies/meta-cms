import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
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

            for (const item of items) {
                // console.log(item.product.variants, "Variants")
                for (const variant of item.product.variants) {
                    if (variant.variantId === item.variantId) {

                        if (item.quantity > variant.quantity) {
                            throw new BadRequestException({
                                message: 'Insufficient stock available',
                                product: item.product.title
                            })
                        }

                        if (variant.discountedPrice) {
                            totalPrice += variant.discountedPrice * item.quantity
                            return
                        }
                        totalPrice += variant.price * item.quantity;
                        await this.productService.updateVariantQuantity(item?.product._id, item.variantId, -item.quantity);
                    }
                }
            };

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


    async initiatePayment(userId: string) {

        // Get cart details
        const cart = await this.cartService.getCart(userId);

        if (!cart || !cart.items.length) {
            throw new BadRequestException('Cart is empty!');
        }

        // Calculate total amount
        let totalAmount = 0;

        for (const item of cart.items) {

            for (const variant of item.product.variants) {
                if (variant.variantId === item.variantId) {

                    if (item.quantity > variant.quantity) {
                        throw new BadRequestException({
                            message: 'Insufficient stock available',
                            product: item.product.title
                        })
                    }

                    if (variant.discountedPrice) {
                        totalAmount += variant.discountedPrice * item.quantity
                        return
                    }
                    totalAmount += variant.price * item.quantity;
                }
            }
        };

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

            for (const item of items) {
                // console.log(item.product.variants, "Variants")
                for (const variant of item.product.variants) {
                    if (variant.variantId === item.variantId) {

                        if (item.quantity > variant.quantity) {
                            throw new BadRequestException({
                                message: 'Insufficient stock available',
                                product: item.product.title
                            })
                        }

                        if (variant.discountedPrice) {
                            totalPrice += variant.discountedPrice * item.quantity
                            return
                        }
                        totalPrice += variant.price * item.quantity;
                        await this.productService.updateVariantQuantity(item?.product._id, item.variantId, -item.quantity);
                    }
                }
            };

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

        const orders = await this.Order.find(query)
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

    async getlastOrder(vendorId: string) {
        const query = {}
        if (vendorId) {
            query['vendor'] = vendorId;
        }
        const order = await this.Order.find(query).sort({ createdAt: -1 }).limit(10).populate({
            path: "user",
            select: "name email role"
        }).populate({
            path: "vendor",
            select: "name email role"
        });
        return order;
    }

    async getMonthlyOrderCount(vendorId: string) {
        // If userId is provided, it fetches posts by userId. Otherwise it fetches all posts
        // Assuming userId exists and is coming from JWT

        const currentDate = new Date();
        const lastYearDate = new Date()
        lastYearDate.setMonth(currentDate.getMonth() - 12);

        const matchFilter: Record<string, any> = {
            createdAt: { $gte: lastYearDate }
        };
        if (vendorId) {
            matchFilter.vendor = mongoose.Types.ObjectId.createFromHexString(vendorId); // Assuming 'createdBy' is the field storing userId
        }

        const result = await this.Order.aggregate([
            {
                $match: matchFilter
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    count: 1,
                    _id: 0
                }
            }
        ]).exec();

        // Create an array for the last 12 months (starting from the current month)
        const monthlyOrderCount = [];
        let tempDate = new Date(currentDate);
        for (let i = 0; i < 12; i++) {
            const currentMonth = { month: tempDate.getMonth() + 1, year: tempDate.getFullYear() };
            const currentCount = result.find(r => r.month === currentMonth.month && r.year === currentMonth.year);
            monthlyOrderCount.push(currentCount ? currentCount : { month: currentMonth.month, year: currentMonth.year, count: 0 });

            // Construct a new Date object here. Otherwise, the months might repeat(due to different number of days in each month)
            tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth() - 1);
        }

        // Return the array in reverse order (oldest to most recent)
        return monthlyOrderCount.reverse();

    }

    async getTotalOrderCount(vendorId: string) {
        const query = {}
        if (vendorId) {
            query['vendor'] = new mongoose.Types.ObjectId(vendorId);
        }

        const orderCount = await this.Order.countDocuments(query);

        return orderCount;
    }

    async getTopSellingProducts(vendorId: string) {
        const matchFilter: any = {};

        // If vendorId is provided, filter orders by vendor
        if (vendorId) {
            matchFilter.vendor = new mongoose.Types.ObjectId(vendorId);
        }

        const result = await this.Order.aggregate([
            {
                $match: matchFilter // Apply vendor filter if provided
            },
            {
                $unwind: "$items" // Break down order items
            },
            {
                $group: {
                    _id: "$items.product",
                    totalSoldQuantity: { $sum: "$items.quantity" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: { totalSoldQuantity: -1 } // Sort by quantity sold
            },
            {
                $limit: 5 // Get top 5
            },
            {
                $lookup: {
                    from: "products", // Ensure this matches your collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: { path: "$product", preserveNullAndEmptyArrays: true } // Prevent errors if no product found
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$product.name",
                    price: "$product.price",
                    image: "$product.image",
                    totalSoldQuantity: 1,
                    totalOrders: 1
                }
            }
        ]).exec();


        const topItems = await Promise.all(
            result.map(async (item: any) => {
                const product = await this.productService.getProductById(item.productId, undefined, undefined);
                delete item.productId;
                item['product'] = product;
                return item;
            })
        );

        return topItems;
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

        const order = await this.Order.findOne({_id: orderId}).populate('items.product').exec();

        if (!order) {
            throw new NotFoundException('Order not found.');
        }

        for (const item of order.items) {
            await this.productService.updateVariantQuantity(item.product._id.toString(), item.variantId, item.quantity)
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