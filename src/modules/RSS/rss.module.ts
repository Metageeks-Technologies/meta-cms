import { forwardRef, Module } from "@nestjs/common";
import { RSSController } from "./rss.controller";
import { RSSService } from "./rss.service";
import { MongooseModule } from "@nestjs/mongoose";
import { rssSchema } from "./schema/rss.schema";
import { PostsModule } from "../posts/posts.module";
import { WebsiteModule } from "../website/website.module";
import { RedisModule } from "../redis/redis.module";




@Module({
    imports: [
        MongooseModule.forFeature([{name: "RSS", schema: rssSchema}]),
        forwardRef(() => PostsModule),
        WebsiteModule,
        RedisModule
    ],
    controllers: [RSSController],
    providers: [RSSService],
    exports: [RSSService]
})

export class RSSModule { }