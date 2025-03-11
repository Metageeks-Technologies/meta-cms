import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { CommentModule } from '../comment/comment.module';
import { WebsiteModule } from '../website/website.module';
import { SiteMapModule } from '../siteMap/sitemap.module';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    UsersModule,
    LikesModule,
    BookmarksModule,
    CommentModule,
    WebsiteModule,
    forwardRef(() => SiteMapModule)
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
