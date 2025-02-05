import { Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { WebsiteSchema } from "./schema/website.schema";
import { UsersModule } from "../users/users.module";



@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Website", schema: WebsiteSchema }]),
        UsersModule
    ],
    providers: [WebsiteService],
    controllers: [WebsiteController]
})

export class WebsiteModule { }