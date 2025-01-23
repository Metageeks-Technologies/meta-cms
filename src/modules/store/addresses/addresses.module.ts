import { Module } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { AddressController } from "./addresses.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AddressSchema } from "./schema/address.schema";
import { RedisModule } from "src/modules/redis/redis.module";
import { UsersModule } from "src/modules/users/users.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Address", schema: AddressSchema }]),
        RedisModule,
        UsersModule
    ],
    controllers: [AddressController],
    providers: [AddressService]
})

export class AddressModule {}