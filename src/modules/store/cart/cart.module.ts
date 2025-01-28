import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CartSchema } from "./schema/cart.schema";
import { ProductModule } from "../product/product.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Cart", schema: CartSchema }]),
        ProductModule,
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})

export class CartModule { }