import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { caseStudySchema } from "./schema/caseStudy.schema";
import { CaseStudyService } from "./caseStudy.service";
import { CaseStudyController } from "./caseStudy.controller";
import { WebsiteModule } from "../website/website.module";
import { UsersModule } from "../users/users.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: "CaseStudy", schema: caseStudySchema}]),
        UsersModule,
        WebsiteModule
    ],
    providers: [CaseStudyService],
    controllers: [CaseStudyController]
})

export class CaseStudyModule { }