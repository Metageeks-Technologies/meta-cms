import { forwardRef, Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { WebsiteSchema } from "./schema/website.schema";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Website", schema: WebsiteSchema }]),
        forwardRef(() => UsersModule)
    ],
    providers: [WebsiteService],
    controllers: [WebsiteController],
    exports: [WebsiteService]
})

export class WebsiteModule { }