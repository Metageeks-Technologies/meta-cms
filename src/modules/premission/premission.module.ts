import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PremissionSchema } from "./schema/premission.schema";
import { PremissionService } from "./premission.service";
import { PremissionController } from "./premission.controller";
import { UsersModule } from "../users/users.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Premission", schema: PremissionSchema }]),
        UsersModule
    ],
    providers: [PremissionService],
    controllers: [PremissionController]
})

export class PremissionModule { }