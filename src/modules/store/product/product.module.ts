import { Module } from "@nestjs/common";
import { PorductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductSchema } from "./schema/product.schema";
import { ProductCategoriesModule } from "../productCategories/productCategories.module";
import { UsersModule } from "src/modules/users/users.module";




@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
        ProductCategoriesModule,
        UsersModule
    ],
    controllers: [PorductController],
    providers: [ProductService]
})

export class ProductModule { }