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
import { LoggerModule } from './modules/logger/logger.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PagesModule } from './modules/pages/pages.module';
import { RedisModule } from './modules/redis/redis.module';
import { ProductCategoriesModule } from './modules/store/productCategories/productCategories.module';
import { AddressModule } from './modules/store/addresses/addresses.module';
import { ProductModule } from './modules/store/product/product.module';
import { CartModule } from './modules/store/cart/cart.module';
import { OrderModule } from './modules/store/order/order.module';
import { WebsiteModule } from './modules/website/website.module';


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
    BookmarksModule,
    DashboardModule,
    PagesModule,
    RedisModule,
    ProductCategoriesModule,
    AddressModule,
    ProductModule,
    CartModule,
    OrderModule,
    WebsiteModule
  ],
  controllers: [AppController],
  providers: [
    {
      // Filter to catch all HttpExceptions ( so we can log exceptions which caused Internal server error
      // Requires Logger module (LoggerService to be exact) to be available here in AppModule
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {

    const allowedOrigins = process.env.CLIENT_URLS.split(',');

    // CORS middleware
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true); // Allow the request
        } else {
          callback(null, false); // Reject the request
        }
      },
      credentials: true, // Allow credentials (cookies/authorization headers)
    };

    // Use CORS middleware
    consumer.apply(cors(corsOptions)).forRoutes('*');

    // Cookie Parser middleware
    consumer.apply(cookieParser()).forRoutes('*');

    // Request Logger middleware
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

