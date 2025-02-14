import { Module } from "@nestjs/common";
import { UnitController } from "./units.controller";
import { UnitService } from "./units.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UnitSchema } from "./schema/unit.schema";
import { RedisModule } from "src/modules/redis/redis.module";
import { WebsiteModule } from "src/modules/website/website.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema}]),
        RedisModule,
        WebsiteModule
    ],
    controllers: [UnitController],
    providers: [UnitService]
})

export class UnitModule { }