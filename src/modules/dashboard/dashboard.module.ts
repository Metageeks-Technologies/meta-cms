import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../store/order/order.module';
import { ProductModule } from '../store/product/product.module';

@Module({
  imports: [PostsModule, UsersModule, OrderModule, ProductModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
