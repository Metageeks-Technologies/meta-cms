import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '../users/schema/user.schema';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { OrderService } from '../store/order/order.service';
import { ProductService } from '../store/product/product.service';
import { postStatuEnum } from 'client/src/constant/post';

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
    const [publishedPostsCount, totalPostCount, monthlyPublishedPostsCount] = await Promise.all([
      this.postsService.getPostsCount(websiteKey, userId, postStatuEnum.PUBLISHED),
      this.postsService.getPostsCount(websiteKey, userId, undefined),
      this.postsService.getMonthlyPublishedPostCount(websiteKey, userId)
    ])

    return { publishedPostsCount, totalPostCount, monthlyPublishedPostsCount };
  }

  async getGlobalData(websiteKey: string) {
    const [usersCount, publishedPostsCount, totalPostCount, monthlyPublishedPostsCount] = await Promise.all([
      this.usersService.getUsersCount(websiteKey),
      this.postsService.getPostsCount(websiteKey, undefined, postStatuEnum.PUBLISHED),
      this.postsService.getPostsCount(websiteKey, undefined, undefined),
      this.postsService.getMonthlyPublishedPostCount(websiteKey)
    ])

    return { usersCount, publishedPostsCount, totalPostCount, monthlyPublishedPostsCount };
  }

  async getStoreAdminData(websiteKey: string) {
    const [totalOrderCount, totalProductCount, storeUserCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct] = await Promise.all([
      this.orderService.getTotalOrderCount(websiteKey, undefined),
      this.productService.getProductCount(websiteKey, undefined),
      this.usersService.getStoreUsersCount(),
      this.orderService.getlastOrder(websiteKey, undefined),
      this.productService.getLatestProduct(websiteKey, undefined),
      this.orderService.getMonthlyOrderCount(websiteKey, undefined),
      this.orderService.getTopSellingProducts(websiteKey, undefined)
    ])

    return { totalOrderCount, totalProductCount, storeUserCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct }
  }

  async getStoreVendorData(websiteKey: string, vendorId: string) {
    const [totalOrderCount, totalProductCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct] = await Promise.all([
      this.orderService.getTotalOrderCount(websiteKey, vendorId),
      this.productService.getProductCount(websiteKey, vendorId),
      this.orderService.getlastOrder(websiteKey, vendorId),
      this.productService.getLatestProduct(websiteKey, vendorId),
      this.orderService.getMonthlyOrderCount(websiteKey, vendorId),
      this.orderService.getTopSellingProducts(websiteKey, vendorId)
    ])

    return { totalOrderCount, totalProductCount, recentOrder, recentProduct, monthlyOrdersCount, topSellingProduct }
  }


}
