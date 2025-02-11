import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '../users/schema/user.schema';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { OrderService } from '../store/order/order.service';
import { ProductService } from '../store/product/product.service';

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private orderService: OrderService,
    private productService: ProductService,
  ) { }

  async getPersonalData(websiteKey: string, userId: string, userRole: UserRoleEnum) {
    // Assuming userId is verified and is coming from jwt
    const [publishedPostsCount, monthlyPublishedPostsCount] = await Promise.all([
      this.postsService.getPublisedPostsCount(websiteKey, userId),
      this.postsService.getMonthlyPublishedPostCount(websiteKey, userId)
    ])

    return { publishedPostsCount, monthlyPublishedPostsCount };
  }

  async getGlobalData(websiteKey: string) {
    const [usersCount, publishedPostsCount, monthlyPublishedPostsCount] = await Promise.all([
      this.usersService.getUsersCount(websiteKey),
      this.postsService.getPublisedPostsCount(websiteKey),
      this.postsService.getMonthlyPublishedPostCount(websiteKey)
    ])

    return { usersCount, publishedPostsCount, monthlyPublishedPostsCount };
  }

  async getStoreAdminData() {
    const [totalOrderCount, totalProductCount, storeUserCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct] = await Promise.all([
      this.orderService.getTotalOrderCount(undefined),
      this.productService.getProductCount(undefined),
      this.usersService.getStoreUsersCount(),
      this.orderService.getlastOrder(undefined),
      this.productService.getLatestProduct(undefined),
      this.orderService.getMonthlyOrderCount(undefined),
      this.orderService.getTopSellingProducts(undefined)
    ])

    return { totalOrderCount, totalProductCount, storeUserCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct }
  }

  async getStoreVendorData(vendorId: string) {
    const [totalOrderCount, totalProductCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct] = await Promise.all([
      this.orderService.getTotalOrderCount(vendorId),
      this.productService.getProductCount(vendorId),
      this.orderService.getlastOrder(vendorId),
      this.productService.getLatestProduct(vendorId),
      this.orderService.getMonthlyOrderCount(vendorId),
      this.orderService.getTopSellingProducts(vendorId)
    ])

    return { totalOrderCount, totalProductCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct }
  }


}
