import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PermissionSchema } from "./schema/permission.schema";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { UsersModule } from "../users/users.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Permission", schema: PermissionSchema }]),
        UsersModule
    ],
    providers: [PermissionService],
    controllers: [PermissionController]
})

export class PermissionModule { }