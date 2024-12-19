import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
import { LoggerModule } from './common/logger/logger.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    LoggerModule,
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
  providers: [
    {
      // Filter to catch all HttpExceptions ( so we can log exceptions which caused Internal server error
      // Requires Logger module (LoggerService to be exact) to be available here in AppModule
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {

    // CORS middleware
    consumer.apply(cors({ 
      origin: process.env.CLIENT_URL,
      credentials: true 
    })).forRoutes('*');
    
    // Cookie Parser middleware
    consumer.apply(cookieParser()).forRoutes('*');
    
    // Request Logger middleware
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

