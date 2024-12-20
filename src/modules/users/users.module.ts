import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { BookmarksModule } from '../bookmarks/bookmarks.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    BookmarksModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
