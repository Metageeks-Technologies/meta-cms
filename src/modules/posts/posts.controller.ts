import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ForbiddenException, All, Headers } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../users/schema/user.schema';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Request } from 'express';
import { GetPostsQueryDto, PostSortByEnum } from './dto/get-post.dto';
import { PostStatusEnum } from './schema/post.schema';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { SearchPostsQueryDto } from './dto/search-post.dto';
import { CreateCommentDto } from '../comment/dto/create-comment-dto';
import { userRoles } from 'client/src/constant/user';
import { commentQueryDto } from '../comment/dto/comment-query-dto';
import { UpdateCommentDto } from '../comment/dto/update-comment-dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createPost(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() newPostData: CreatePostDto) {
    const { _id: authorId, role: authorRole } = (req as any).user;
    await this.postsService.createPost(websiteKey, newPostData, authorId, authorRole);
    return { message: "Post created successfully" };
  }

  @Get('search')
  async searchPosts(@Headers('websiteKey') websiteKey: string, @Query() query: SearchPostsQueryDto) {
    const posts = await this.postsService.searchPosts(websiteKey, query);
    return posts;
  }

  @Get('public')
  async getPublicPosts(@Query() query: GetPostsQueryDto) {
    const publicPosts = await this.postsService.getPosts(
      query.website,
      PostStatusEnum.PUBLISHED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount,
    );
    return publicPosts;
  }

  @Get('v2/public')
  async getPublicPostsV2(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const publicPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.PUBLISHED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount,
    );
    return publicPosts;
  }

  @Get('public/:slug')
  async getPublicPostById(@Param('slug') slug: string, @Query() query: {website: string}) {
    const publicPost = await this.postsService.getPublicPostBySlug( query.website, slug);
    return publicPost;
  }

  @Get('v2/public/:slug')
  async getPublicPostByIdV2(@Headers('websiteKey') websiteKey: string, @Param('slug') slug: string) {
    const publicPost = await this.postsService.getPublicPostBySlug( websiteKey, slug);
    return publicPost;
  }

  @Post('public/:id/like')
  @UseGuards(AuthGuard)
  async likePublicPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.likePublicPost(websiteKey, postId, userId);
    return { message: 'Liked successfully' };
  }

  @Delete('public/:id/unlike')
  @UseGuards(AuthGuard)
  async unlikePublicPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.unlikePublicPost(websiteKey, postId, userId);
    return { message: 'Unliked successfully' };
  }

  @Get('public/:id/is-liked-and-bookmarked')
  @UseGuards(AuthGuard)
  async isPostLikedByuser(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    const isLikedAndBookmarked = await this.postsService.isPostLikedAndBookmarkedByUser(websiteKey, postId, userId);
    return isLikedAndBookmarked;
  }

  @Post('public/:id/bookmark')
  @UseGuards(AuthGuard)
  async bookmarkPublicPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.bookmarkPublicPost(websiteKey, postId, userId);
    return { message: 'Bookmarked successfully' };
  }

  @Delete('public/:id/bookmark')
  @UseGuards(AuthGuard)
  async removeBookmarkFromPublicPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.removeBookmarkFromPublicPost(websiteKey, postId, userId);
    return { message: 'Bookmark removed successfully' };
  }

  @Post('public/comment/:postId')
  @UseGuards(AuthGuard)
  async commentPublishedPost(@Headers('websiteKey') websiteKey: string, @Param('postId', ValidateId) postId: string, @Req() req: Request, @Body() newCommentDetails: CreateCommentDto) {
    const userId = (req as any).user._id;
    await this.postsService.commentPublishedPost(websiteKey, postId, userId, newCommentDetails.message);
    return { message: "Comment add successfully" }
  }

  @Patch('comment/:postId/approve/:commentId')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async approveUsersComment(@Headers('websiteKey') websiteKey: string, @Param('postId', ValidateId) postId: string, @Param('commentId', ValidateId) commentId: string) {
    await this.postsService.approveComment(websiteKey, postId, commentId);
    return { message: "Comment approved" }
  }

  @Patch('comment/reject/:commentId')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectUsersComment(@Headers('websiteKey') websiteKey: string, @Param('commentId', ValidateId) commentId: string) {
    await this.postsService.rejectComment(websiteKey, commentId);
    return { message: "Comment rejected" }
  }

  @Get('comment/awaiting-approval')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAwatingApprovalComments(@Headers('websiteKey') websiteKey: string,) {
    const comments = await this.postsService.getAwaitingApproveComment(websiteKey);
    return comments;
  }

  @Delete('comment/:postId/delete/:commentId')
  @AllowedRoles(UserRoleEnum.SUBSCRIBER, UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteComment(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Param('postId', ValidateId) postId: string, @Param('commentId', ValidateId) commentId: string) {
    const user = (req as any).user;
    await this.postsService.deleteComment(websiteKey, postId, user._id, user.role, commentId);
    return { message: "Comment deleted succesfully" }
  }

  @Get('public/comment/:postId')
  async publicComments(@Headers('websiteKey') websiteKey: string, @Param('postId', ValidateId) postId: string, @Query() query: commentQueryDto) {
    const comments = await this.postsService.getPublishedCommentOnPost(websiteKey, postId, query.lastId);
    return comments;
  }

  @Get('comment/all-rejected')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async allRejectedComments(@Headers('websiteKey') websiteKey: string, @Query() query: commentQueryDto) {
    const comments = await this.postsService.getAllRejectedComments(websiteKey, query.lastId);
    return comments;
  }

  @Get('comment/all-published')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async allPublishedComments(@Headers('websiteKey') websiteKey: string, @Query() query: commentQueryDto) {
    const comments = await this.postsService.getAllPublishedComments(websiteKey, query.lastId);
    return comments;
  }

  @Get('comment/all-deleted')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async allDeletedComments(@Headers('websiteKey') websiteKey: string, @Query() query: commentQueryDto) {
    const comments = await this.postsService.getAllDeletedComments(websiteKey, query.lastId);
    return comments;
  }

  @Patch('comment/edit/:commentId')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async editComment(@Headers('websiteKey') websiteKey: string, @Param('commentId', ValidateId) commentId: string, @Req() req: Request, @Body() commentDetails: UpdateCommentDto) {
    const user = (req as any).user
    await this.postsService.editComment(websiteKey, user._id, user.role, commentId, commentDetails?.message);
    return { message: "Comment edit successfully" }
  }

  @Patch('comment/recover/:commentId')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recoverComment(@Headers('websiteKey') websiteKey: string, @Param('commentId', ValidateId) commentId: string) {
    await this.postsService.recoverComment(websiteKey, commentId);
    return { message: "Comment recover successfully" }
  }

  @Get('my/all')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserAllPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const myAllPosts = await this.postsService.getPosts(
      websiteKey,
      query.status,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return myAllPosts;
  }

  @Get('my/draft')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserDraftPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const draftPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.DRAFT,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return draftPosts;
  }

  @Get('my/published')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserPublishedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const publishedPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.PUBLISHED,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return publishedPosts;
  }

  @Get('my/scheduled')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserScheduledPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const scheduledPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.SCHEDULED,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return scheduledPosts;
  }

  @Get('my/rejected')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserRejectedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const rejectedPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.REJECTED,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return rejectedPosts;
  }

  @Get('my/awaiting-approval')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserAwaitingApprovalPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const awaitingApprovalPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.AWAITING_APPROVAL,
      false,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return awaitingApprovalPosts;
  }

  @Get('my/deleted')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserDeletedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const deletedPosts = await this.postsService.getPosts(
      websiteKey,
      query.status,
      true,
      authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return deletedPosts;
  }

  @Get('my/all-tags')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserAllTags(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const allTags = await this.postsService.getAllTags(websiteKey, authorId);
    return allTags;
  }


  @Get('all-published')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllPublishedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const publishedPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.PUBLISHED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return publishedPosts;
  }

  @Get('all-scheduled')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllScheduledPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const scheduledPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.SCHEDULED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return scheduledPosts;
  }

  @Get('all-rejected')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllRejectedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const rejectedPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.REJECTED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return rejectedPosts;
  }

  @Get('all-awaiting-approval')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllAwaitingApprovalPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const awaitingApprovalPosts = await this.postsService.getPosts(
      websiteKey,
      PostStatusEnum.AWAITING_APPROVAL,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return awaitingApprovalPosts;
  }

  @Get('all-deleted')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllDeletedPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const deletedPosts = await this.postsService.getPosts(
      websiteKey,
      query.status,
      true,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return deletedPosts;
  }

  // In this route, a contributor can see only his posts
  // Moderators and superadmins can fetch any post
  @Get(':slug')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getPostById(@Headers('websiteKey') websiteKey: string, @Param('slug') slug: string, @Req() req: Request) {
    const post = await this.postsService.getAnyPostBySlug(websiteKey, slug, (req as any).user._id, (req as any).user.role);
    return post;
  }

  @Patch(':id/approve')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async approvePost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.postsService.approvePost(websiteKey, id);
    return { message: "Post approved successfully" };
  }

  @Patch(':id/reject')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.postsService.changePostStatus(websiteKey, id, PostStatusEnum.REJECTED);
    return { message: "Post rejected successfully" };
  }

  @Patch(':id')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updatePost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string, @Body() updatedPost: UpdatePostDto, @Req() req: Request) {
    await this.postsService.updatePost(websiteKey, id, updatedPost, (req as any).user._id, (req as any).user.role);
    return { message: "Post updated successfully" };
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deletePost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string, @Req() req: Request) {
    await this.postsService.deletePost(websiteKey, id, (req as any).user._id, (req as any).user.role);
    return { message: "Post deleted successfully" };
  }

  @Patch(':id/recover')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recoverPost(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.postsService.recoverPost(websiteKey, id);
    return { message: "Post recovered successfully" };
  }

  @Get()
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllPosts(@Headers('websiteKey') websiteKey: string, @Query() query: GetPostsQueryDto) {
    const posts = await this.postsService.getPosts(
      websiteKey,
      query.status,
      query.isDeleted,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount,
      query.searchQuery
    );
    return posts;
  }

}
