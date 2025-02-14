import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema } from "./schema/order.schema";
import { CartModule } from "../cart/cart.module";
import { UsersModule } from "src/modules/users/users.module";
import { ProductModule } from "../product/product.module";
import { PaymentModule } from "../payment/payment.module";
import { WebsiteService } from "src/modules/website/website.service";
import { WebsiteModule } from "src/modules/website/website.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Order", schema: OrderSchema}]),
        ProductModule,
        CartModule,
        UsersModule,
        PaymentModule,
        WebsiteModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})

export class OrderModule { }