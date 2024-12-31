import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '../users/schema/user.schema';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService
  ) { }

  async getPersonalData(userId: string, userRole: UserRoleEnum) {
    // Assuming userId is verified and is coming from jwt
    const [ publishedPostsCount, monthlyPublishedPostsCount ] = await Promise.all([
      this.postsService.getPublisedPostsCount(userId),
      this.postsService.getMonthlyPublishedPostCount(userId)
    ])

    return { publishedPostsCount, monthlyPublishedPostsCount };
  }

  async getGlobalData() {
    const [ usersCount, publishedPostsCount, monthlyPublishedPostsCount ] = await Promise.all([
      this.usersService.getUsersCount(),
      this.postsService.getPublisedPostsCount(),
      this.postsService.getMonthlyPublishedPostCount()
    ])

    return { usersCount, publishedPostsCount, monthlyPublishedPostsCount };
  }
}
