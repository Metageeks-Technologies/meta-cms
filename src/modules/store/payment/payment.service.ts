import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const Razorpay = require("razorpay");
import * as crypto from 'crypto';




@Injectable()
export class PaymentService {

    private razorpay: InstanceType<typeof Razorpay>;

    constructor(private configService: ConfigService) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY'),
            key_secret: this.configService.get('RAZORPAY_SECRET')
        });
    }


    async createOrder(amount: number) {
        try {
            const options = {
                amount: amount * 100, // Convert into paise
                currency: 'INR',
                receipt: `order_${Date.now()}`
            }

            const order = this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }


    async verifyPayment(
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
    ) {
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET'))
            .update(body.toString())
            .digest('hex');


        const isAuthentic = expectedSignature === razorpay_signature;

        return {
            success: isAuthentic,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
        };
    }


}