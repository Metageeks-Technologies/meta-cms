import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PageSchema } from "./schema/page.schema";
import { PagesService } from "./pages.service";
import { PagesController } from "./pages.controller";
import { UsersModule } from "../users/users.module";
import { WebsiteModule } from "../website/website.module";



@Module({
   imports: [ 
       MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }]), 
       UsersModule,
       WebsiteModule
     ],
     controllers: [PagesController],
     providers: [PagesService],
})
export class PagesModule {}