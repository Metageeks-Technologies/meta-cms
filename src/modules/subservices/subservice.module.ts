import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { SubserviceSchema } from './schema/subservice.schema';
import { UsersModule } from '../users/users.module';
import { WebsiteModule } from '../website/website.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Subservice", schema: SubserviceSchema }]),
    UsersModule,
    WebsiteModule
  ],
  providers: [SubserviceService],
  controllers: [SubserviceController],
  exports: [SubserviceService]
})
export class SubserviceModule {}
