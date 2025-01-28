import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema } from "./schema/order.schema";
import { CartModule } from "../cart/cart.module";
import { UsersModule } from "src/modules/users/users.module";
import { ProductModule } from "../product/product.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Order", schema: OrderSchema}]),
        ProductModule,
        CartModule,
        UsersModule
    ],
    controllers: [OrderController],
    providers: [OrderService]
})

export class OrderModule { }