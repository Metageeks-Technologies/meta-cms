import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { caseStudySchema } from "./schema/caseStudy.schema";
import { CaseStudyService } from "./caseStudy.service";
import { CaseStudyController } from "./caseStudy.controller";
import { WebsiteModule } from "../website/website.module";
import { UsersModule } from "../users/users.module";
import { SiteMapModule } from "../siteMap/sitemap.module";
import { RedisModule } from "../redis/redis.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: "CaseStudy", schema: caseStudySchema}]),
        UsersModule,
        WebsiteModule,
        forwardRef(() => SiteMapModule),
        RedisModule
    ],
    providers: [CaseStudyService],
    controllers: [CaseStudyController],
    exports: [CaseStudyService]
})

export class CaseStudyModule { }