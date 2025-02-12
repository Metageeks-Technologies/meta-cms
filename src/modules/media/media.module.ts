import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaSchema } from './schema/media.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { WebsiteModule } from '../website/website.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
    UsersModule,
    WebsiteModule
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
