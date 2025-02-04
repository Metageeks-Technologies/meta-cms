import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment-dto";
import { VerifyPaymentDto } from "./dto/verify-payment-dto";



@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

}