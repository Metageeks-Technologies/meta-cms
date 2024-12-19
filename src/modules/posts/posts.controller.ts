import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
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
import mongoose from 'mongoose';
import { SearchPostsQueryDto } from './dto/search-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createPost(@Req() req: Request, @Body() newPostData: CreatePostDto) {
    const { _id: authorId, role: authorRole } = (req as any).user;
    await this.postsService.createPost(newPostData, authorId, authorRole);
    return { message: "Post created successfully " };
  }

  @Get()
  async getPosts(@Query() query: GetPostsQueryDto) {
    const posts = await this.postsService.getPosts(
      query.status,
      query.isDeleted,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return posts;
  }

  @Get('search')
  async searchPosts(@Query() query: SearchPostsQueryDto) {
    const posts = await this.postsService.searchPosts(query);
    return posts;
  }

  @Get('public')
  async getPublicPosts(@Query() query: GetPostsQueryDto) {
    const publicPosts = await this.postsService.getPosts(
      PostStatusEnum.PUBLISHED,
      false,
      query.authorId,
      query.tags,
      query.categories,
      query.sortBy,
      query.lastId,
      query.lastLikesCount
    );
    return publicPosts;
  }

  @Get('public/:slug')
  async getPublicPostById(@Param('slug') slug: string) {
    const publicPost = await this.postsService.getPublicPostBySlug(slug);
    return publicPost;
  }

  @Post('public/:id/like')
  @UseGuards(AuthGuard)
  async likePublicPost(@Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.likePublicPost(postId, userId);
    return { message: 'Liked successfully' };
  }

  @Delete('public/:id/unlike')
  @UseGuards(AuthGuard)
  async unlikePublicPost(@Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    await this.postsService.unlikePublicPost(postId, userId);
    return { message: 'Unliked successfully' };
  }

  @Get('public/:id/likedByMe')
  @UseGuards(AuthGuard)
  async isPostLikedByuser(@Param('id', ValidateId) postId: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    const isPostLikedByUser = await this.postsService.isPostLikedByUser(postId, userId);
    return { isPostLikedByMe: isPostLikedByUser };
  }

  @Get('my/drafts')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserDraftPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const draftPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserPublishedPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const publishedPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserScheduledPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const scheduledPosts = await this.postsService.getPosts(
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
  async getUserRejectedPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const rejectedPosts = await this.postsService.getPosts(
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
  async getUserAwaitingApprovalPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const awaitingApprovalPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserDeletedPosts(@Query() query: GetPostsQueryDto, @Req() req: Request) {
    const authorId = (req as any).user._id;
    const deletedPosts = await this.postsService.getPosts(
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

  @Get('all-published')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllPublishedPosts(@Query() query: GetPostsQueryDto) {
    const publishedPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllScheduledPosts(@Query() query: GetPostsQueryDto) {
    const scheduledPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllRejectedPosts(@Query() query: GetPostsQueryDto) {
    const rejectedPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllAwaitingApprovalPosts(@Query() query: GetPostsQueryDto) {
    const awaitingApprovalPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllDeletedPosts(@Query() query: GetPostsQueryDto) {
    const deletedPosts = await this.postsService.getPosts(
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
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getPostById(@Param('slug') slug: string, @Req() req: Request) {
    const post = await this.postsService.getAnyPostBySlug(slug, (req as any).user._id, (req as any).user.role);
    return post;
  }

  @Patch(':id/approve')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async approvePost(@Param('id', ValidateId) id: string) {
    await this.postsService.approvePost(id);
    return { message: "Post approved successfully" };
  }

  @Patch(':id/reject')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectPost(@Param('id', ValidateId) id: string) {
    await this.postsService.changePostStatus(id, PostStatusEnum.REJECTED);
    return { message: "Post rejected successfully" };
  }

  @Patch(':id')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updatePost(@Param('id', ValidateId) id: string, @Body() updatedPost: UpdatePostDto, @Req() req: Request) {
    await this.postsService.updatePost(id, updatedPost, (req as any).user._id, (req as any).user.role);
    return { message: "Post updated successfully" };
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deletePost(@Param('id', ValidateId) id: string, @Req() req: Request) {
    await this.postsService.deletePost(id, (req as any).user._id, (req as any).user.role);
    return { message: "Post deleted successfully" };
  }

  @Patch(':id/recover')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recoverPost(@Param('id', ValidateId) id: string) {
    await this.postsService.recoverPost(id);
    return { message: "Post recovered successfully" };
  }
}
