import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceSchema } from './schema/service.schema';
import { UsersModule } from '../users/users.module';
import { WebsiteModule } from '../website/website.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Service", schema: ServiceSchema }]),
    UsersModule,
    WebsiteModule
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
