import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { Subservice, SubserviceSchema } from './schema/subservice.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subservice.name, schema: SubserviceSchema }])],
  providers: [SubserviceService],
  controllers: [SubserviceController],
})
export class SubserviceModule {}
