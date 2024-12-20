import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    UsersModule,
    LikesModule,
    BookmarksModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
