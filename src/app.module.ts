import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaModule } from './modules/media/media.module';
import { LikesModule } from './modules/likes/likes.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AuthModule,
    UsersModule,
    PostsModule,
    NotificationsModule,
    MediaModule,
    LikesModule,
    CategoriesModule,
    SubscribersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {

    // cors
    consumer.apply(cors({ 
      origin: process.env.CLIENT_URL,
      credentials: true 
    })).forRoutes('*');
    
    // Cookie Parser
    consumer.apply(cookieParser()).forRoutes('*');
    
    // Logger
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

