import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { OtpSchema } from './schema/otp.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Otp', schema: OtpSchema}]),
    BookmarksModule,
    RedisModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
