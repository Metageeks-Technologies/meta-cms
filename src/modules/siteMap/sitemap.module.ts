import { forwardRef, Module } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";
import { SitemapController } from "./sitemap.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { sitemapSchema } from "./schema/sitemap.schema";
import { PagesModule } from "../pages/pages.module";
import { CaseStudyModule } from "../caseStudy/caseStudy.module";
import { PostsModule } from "../posts/posts.module";
import { RedisModule } from "../redis/redis.module";
import { WebsiteModule } from "../website/website.module";




@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Sitemap", schema: sitemapSchema }]),
        forwardRef(() => PagesModule),
        forwardRef(() => CaseStudyModule),
        forwardRef(() => PostsModule),
        RedisModule,
        WebsiteModule
    ],
    providers: [SitemapService],
    controllers: [SitemapController],
    exports: [SitemapService]
})

export class SiteMapModule { }