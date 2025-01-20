import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, ParseBoolPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPost, PostStatusEnum } from './schema/post.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { GetPostsQueryDto, PostSortByEnum } from './dto/get-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { slugify } from 'src/utils/slug';
import { UserRoleEnum } from '../users/schema/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { LikesService } from '../likes/likes.service';
import { SearchPostSortByEnum, SearchPostsQueryDto } from './dto/search-post.dto';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { postStatuEnum } from 'client/src/constant/post';
import { CommentService } from '../comment/comment.service';
const readingTime = require('reading-time');

@Injectable()
export class PostsService {
  private readonly POST_BATCH_LIMIT = 10;
  private readonly postAggregationFinalSteps: mongoose.PipelineStage[] = [
    /////////////////////////////////////////
    // Category Lookup stage
    // If a catgory id is not found in the categories collection, it will be ignored and will not be reflected in categoriesDetails
    /////////////////////////////////////////
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      }
    },
    /////////////////////////////////////////
    // Author Lookup stage and unwind stage
    /////////////////////////////////////////
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author',
      }
    },
    {
      $unwind: "$author"
    },
    /////////////////////////////////////////
    // Projection Stage. Hiding sensitive fields
    /////////////////////////////////////////
    {
      $project: {
        'categories.description': 0,
        'categories.bannerImageKey': 0,
        'categories.createdAt': 0,
        'categories.updatedAt': 0,
        'categories.__v': 0,
        'author.createdAt': 0,
        'author.updatedAt': 0,
        'author.__v': 0,
        'author.hash': 0,
        'authorId': 0,
        '__v': 0
      },
    }
  ];

  constructor(
    @InjectModel('Post') private Post: Model<IPost>,
    private likesService: LikesService,
    private bookmarksService: BookmarksService,
    private commentService: CommentService,
  ) { }

  async createUniqueSlugFromTitle(title: string) {
    const noOfPostWithSameTitle = await this.Post.countDocuments({ title: title });
    if (noOfPostWithSameTitle == 0) {
      return slugify(title);
    }
    return `${slugify(title)}-${noOfPostWithSameTitle}`;
  }

  async createPost(newPostData: CreatePostDto, authorId: string, authorRole: UserRoleEnum) {
    // Assumes authorId is coming from JWT and is verified by RolesGuard.
    // Hence we are not checking if id is valid or not
    // Also assuming ids in categories are valid
    // If they are not valid, they will be filtered out during category lookup
    const newPost = new this.Post(newPostData);
    newPost.authorId = mongoose.Types.ObjectId.createFromHexString(authorId);
    // newPost.slug = await this.createUniqueSlugFromTitle(newPost.title);

    const stats = readingTime(newPostData.description);
    newPost.readTime = stats.text;

    // If contributor creates a post to be published/scheduled, change its status to 'awaiting approval'
    if (authorRole === UserRoleEnum.CONTRIBUTOR && (newPost.status === PostStatusEnum.PUBLISHED || newPost.status === PostStatusEnum.SCHEDULED)) {
      newPost.status = PostStatusEnum.AWAITING_APPROVAL;
    }

    try {
      await newPost.save();

    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Slug already exists');
      }
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async getPosts(
    status: PostStatusEnum,
    isDeleted: boolean,
    authorId: string,
    tags: string[],
    categories: string[],
    sortBy: string,
    lastId: string,
    lastLikesCount: number,
    searchQuery?: string,
  ) {
    const pipeline: mongoose.PipelineStage[] = [];

    /////////////////////////////////////////
    // Match stage
    /////////////////////////////////////////
    const matchStage: Record<string, any> = {};

    if (status) {
      matchStage.status = status;
    } else {
      matchStage.status = { $ne: postStatuEnum.DRAFT }
    }

    if (typeof isDeleted !== 'undefined') {
      matchStage.isDeleted = isDeleted;
    }

    if (authorId) {
      matchStage.authorId = mongoose.Types.ObjectId.createFromHexString(authorId);
    }

    if (tags && tags.length > 0) {
      matchStage.tags = { $in: tags };
    }

    if (categories && categories.length > 0) {
      const categoriesIds = categories.map((id) => mongoose.Types.ObjectId.createFromHexString(id));
      matchStage.categories = { $in: categoriesIds };
    }

    // Add text search condition if searchQuery is provided
    if (searchQuery) {
      matchStage.$text = { $search: searchQuery };
    }

    switch (sortBy) {
      case PostSortByEnum.OLDEST:
        if (lastId) {
          matchStage._id = { $gt: mongoose.Types.ObjectId.createFromHexString(lastId) };
        }
        break;

      case PostSortByEnum.RECENT:
        if (lastId) {
          matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
        }
        break;

      case PostSortByEnum.POPULAR:
        if (lastLikesCount && lastId) {
          matchStage.$or = [
            { likesCount: { $lt: lastLikesCount } },
            {
              likesCount: lastLikesCount,
              _id: { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
            }
          ];
        }
        break;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    /////////////////////////////////////////
    // Sorting stage
    /////////////////////////////////////////
    const sortStage: Record<string, 1 | -1 | { $meta: 'textScore' }> = {};
    switch (sortBy) {
      case PostSortByEnum.OLDEST:
        sortStage._id = 1;
        break;

      case PostSortByEnum.RECENT:
        sortStage._id = -1;
        break;

      case PostSortByEnum.POPULAR:
        // Order of insertion is important here. Since sorting order will be based on insertion order
        sortStage.likesCount = -1;
        sortStage._id = -1;
        break;
    }

    // If there's a search query, prioritize sorting by text score first
    if (searchQuery) {
      sortStage.score = { $meta: 'textScore' }; // Sort by text score if search query is present
    }

    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    /////////////////////////////////////////
    // Limit stage
    /////////////////////////////////////////
    pipeline.push({ $limit: this.POST_BATCH_LIMIT });

    /////////////////////////////////////////
    // Finals steps (Lookup and projection)
    /////////////////////////////////////////
    pipeline.push(...this.postAggregationFinalSteps);


    // Execute the aggregation pipeline
    const posts = await this.Post.aggregate(pipeline).exec();
    return posts;
  }


  

  async searchPosts({ query, sortBy, lastId, lastScore }: SearchPostsQueryDto) {
    const pipeline: mongoose.PipelineStage[] = [];

    /////////////////////////////////////////
    // Match stage
    /////////////////////////////////////////
    const matchStage: Record<string, any> = {};
    matchStage.$text = {
      $search: query
    };
    pipeline.push({
      $match: matchStage
    });

    /////////////////////////////////////////
    // Adding score field
    /////////////////////////////////////////
    const addFieldsStage: Record<string, any> = {
      score: { $meta: "textScore" }
    }
    pipeline.push({
      $addFields: addFieldsStage
    });

    /////////////////////////////////////////
    // Pagination Match stage
    // Filters out previously fetched documents
    /////////////////////////////////////////
    if (lastId && lastScore) {
      const paginationMatchStage: Record<string, any> = {};
      if (sortBy == SearchPostSortByEnum.RELEVANCY) {
        paginationMatchStage.$or = [
          { score: { $lt: lastScore } },
          {
            score: lastScore,
            _id: { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
          }
        ];
      } else {
        paginationMatchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
      }

      pipeline.push({
        $match: paginationMatchStage
      })
    }

    /////////////////////////////////////////
    // Sort stage
    /////////////////////////////////////////
    let sortStage: Record<string, 1 | -1> = {};
    if (sortBy == SearchPostSortByEnum.RELEVANCY) {
      sortStage = { score: -1, _id: -1 }
    } else {
      sortStage = { _id: -1 }
    }

    pipeline.push({
      $sort: sortStage
    });

    /////////////////////////////////////////
    // limit stage
    /////////////////////////////////////////
    pipeline.push({
      $limit: this.POST_BATCH_LIMIT
    })

    /////////////////////////////////////////
    // Finals steps (Lookup and projection)
    /////////////////////////////////////////
    pipeline.push(...this.postAggregationFinalSteps);

    // Execute the aggregation pipeline
    const posts = await this.Post.aggregate(pipeline).exec();
    return posts;
  }

  async getPostBySlug(slug: string, status: PostStatusEnum, isDeleted: boolean) {
    const aggregation = await this.Post.aggregate([
      {
        $match: {
          slug: slug,
          // Include these fields in condition only when they are defined
          ...(status && { status: status }),
          ...(isDeleted && { stisDeleted: isDeleted }),
        }
      },
      ...this.postAggregationFinalSteps
    ]).exec();

    const post = aggregation[0];
    if (!post) {
      throw new NotFoundException('Post Not found');
    }
    return post;
  }

  async getPublicPostBySlug(slug: string) {
    const post = await this.getPostBySlug(slug, PostStatusEnum.PUBLISHED, false);
    return post;
  }

  async getAnyPostBySlug(slug: string, userId: string, userRole: UserRoleEnum) {
    const post = await this.getPostBySlug(slug, undefined, undefined);

    // If contributor tries to access post of another user
    if (userRole == UserRoleEnum.CONTRIBUTOR && post.author._id != userId) {
      throw new ForbiddenException();
    }

    return post;
  }

  async changePostStatus(_id: string, newStatus: PostStatusEnum) {
    const query = await this.Post.updateOne({ _id: _id }, { $set: { status: newStatus } }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException("Post not found");
    }
  }

  async approvePost(_id: string) {
    const post = await this.Post.findOne({ _id: _id }, { status: 1, publishedDate: 1 }).lean().exec();
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    let newStatus = PostStatusEnum.PUBLISHED;
    const currentDate = new Date();
    const publishedDate = new Date(post.publishedDate);
    if (publishedDate > currentDate) {
      newStatus = PostStatusEnum.SCHEDULED;
    }

    await this.changePostStatus(_id, newStatus);
  }

  async updatePost(_id: string, updatedPost: UpdatePostDto, authorId: string, authorRole: UserRoleEnum) {
    const post = await this.Post.findOne({ _id: _id }, { authorId: 1 }).lean().exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (authorRole == UserRoleEnum.CONTRIBUTOR) {
      // If a contributor tries to update post of someone else
      if (authorId != post.authorId.toString()) {
        throw new ForbiddenException();
      }

      // If a contributor tries to publish or schedule post, change its status to awaiting approval
      if (updatedPost.status == PostStatusEnum.PUBLISHED || updatedPost.status == PostStatusEnum.SCHEDULED) {
        updatedPost.status = PostStatusEnum.AWAITING_APPROVAL;
      }


    }

    const query = await this.Post.updateOne({ _id: _id }, { $set: updatedPost }).exec();
    // No need to check here if post exists or not. we already checked above
  }

  async likePublicPost(postId: string, userId: string) {
    // TODO: add check here to check if post is public
    const post = await this.Post.findOne({ _id: postId }, { likesCount: 1 }).exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.likesService.createLike(postId, userId);

    // If user already liked the said post, control will not reach here
    // Exception will be thrown by above function (createLike)
    post.likesCount++;
    await post.save();
  }

  async unlikePublicPost(postId: string, userId: string) {
    // TODO: add check here to check if post is public
    const post = await this.Post.findOne({ _id: postId }, { likesCount: 1 }).exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.likesService.removeLike(postId, userId);

    // If user already did not like the said post, control will not reach here
    // Exception will be thrown by above function (removeLike)
    post.likesCount--;
    await post.save();
  }

  async bookmarkPublicPost(postId: string, userId: string) {
    // Assuming userId is valid and verified by JWT
    const post = await this.Post.findOne({ _id: postId }, { _id: 1 }).lean().exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.bookmarksService.add(postId, userId);
  }

  async removeBookmarkFromPublicPost(postId: string, userId: string) {
    // No need to validate for postId and userId here
    // If they are valid and their corresponding bookmark exists, we'll delete it
    // If their corresponding bookmark deos not exist, or even if they are invalid, a not found exception is thrown
    await this.bookmarksService.remove(postId, userId);
  }

  async isPostLikedAndBookmarkedByUser(postId: string, userId: string) {
    // Assuming userId is valid and verified by JWT
    // Not checking existence of post here. 
    // Since if post does not exists, its corresponding like & bookmark entries will not be present
    // Just return true if correspoding entries is found, otherwise false in all other cases
    const [isLiked, isBookmarked] = await Promise.all([
      this.likesService.isPostLikedByUser(postId, userId),
      this.bookmarksService.isPostBookmarkedByUser(postId, userId)
    ]);

    return { isLiked, isBookmarked };
  }

  async deletePost(_id: string, userId: string, userRole: string) {
    const post = await this.Post.findOne({ _id: _id }, { authorId: 1, isDeleted: 1 }).lean().exec();
    if (!post) {
      throw new NotFoundException('Post ID not found');
    }

    // If contributor tries to delete other users' post
    if (userRole == UserRoleEnum.CONTRIBUTOR && post.authorId.toString() != userId) {
      throw new ForbiddenException();
    }

    if (post.isDeleted) {
      throw new BadRequestException("Post already deleted");
    }

    const query = await this.Post.updateOne({ _id: _id }, { isDeleted: true }).exec();
  }

  async recoverPost(_id: string) {
    // This can only be done by superadmin
    const query = await this.Post.updateOne({ _id: _id }, { isDeleted: false }).exec();
    if (query.matchedCount == 0) {
      throw new NotFoundException('Post ID not found');
    }

    if (query.modifiedCount == 0) {
      throw new BadRequestException('Post was not deleted');
    }
  }

  async getPublisedPostsCount(userId?: string) {
    // If userId is provided, it fetches posts by userId. Otherwise it fetches all posts
    // Assuming userId exists and is coming from JWT
    const count = await this.Post.countDocuments({
      status: postStatuEnum.PUBLISHED,
      isDeleted: false,
      ...(userId && { authorId: mongoose.Types.ObjectId.createFromHexString(userId) })
    }).exec();
    return count;
  }

  async getMonthlyPublishedPostCount(userId?: string) {
    // If userId is provided, it fetches posts by userId. Otherwise it fetches all posts
    // Assuming userId exists and is coming from JWT

    const currentDate = new Date();
    const lastYearDate = new Date()
    lastYearDate.setMonth(currentDate.getMonth() - 12);

    const matchFilter: Record<string, any> = {
      status: 'published',
      createdAt: { $gte: lastYearDate }
    };
    if (userId) {
      matchFilter.authorId = mongoose.Types.ObjectId.createFromHexString(userId); // Assuming 'createdBy' is the field storing userId
    }

    const result = await this.Post.aggregate([
      {
        $match: matchFilter
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
          _id: 0
        }
      }
    ]).exec();

    // Create an array for the last 12 months (starting from the current month)
    const monthlyPostsCount = [];
    let tempDate = new Date(currentDate);
    for (let i = 0; i < 12; i++) {
      const currentMonth = { month: tempDate.getMonth() + 1, year: tempDate.getFullYear() };
      const currentCount = result.find(r => r.month === currentMonth.month && r.year === currentMonth.year);
      monthlyPostsCount.push(currentCount ? currentCount : { month: currentMonth.month, year: currentMonth.year, count: 0 });

      // Construct a new Date object here. Otherwise, the months might repeat(due to different number of days in each month)
      tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth() - 1);
    }

    // Return the array in reverse order (oldest to most recent)
    return monthlyPostsCount.reverse();
  }


  async getAllTags(authorId?: string) {
    // get user all unique tags 
    // assume user login for this service
    try {
      const result = await this.Post.aggregate([
        { $match: { authorId: new mongoose.Types.ObjectId(authorId), isDeleted: false } },
        { $match: { tags: { $ne: "" } } },

        { $unwind: '$tags' },

        {
          $group: {
            _id: null,
            uniqueTags: { $addToSet: '$tags' },
          },
        },

        { $project: { _id: 0, tags: { $sortArray: { input: '$uniqueTags', sortBy: 1 } } } },
      ]).exec();
      return result.length > 0 ? result[0].tags : [];
    } catch (error) {
      return { message: 'Error fetching tags', error: error.message };
    }
  }


  async commentPublishedPost(postId: string, userId: string, message: string) {
    // TODO: add check here to check if post is public
    const post = await this.Post.findOne({ _id: postId }, { commentCount: 1 }).exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.commentService.createNewComment(postId, userId, message);
  }

  async approveComment(postId: string, commentId: string) {
    // TODO: add check here to check if post is public
    const post = await this.Post.findOne({ _id: postId }, { commentCount: 1 }).exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.commentService.approveComment(commentId);

  }

  async rejectComment(commentId: string) {
    await this.commentService.rejectComment(commentId);
  }

  async getAwaitingApproveComment() {
    const comments = await this.commentService.awaitingApproveComment();
    return comments;
  }

  async deleteComment(postId: string, userId: string, userRole: string, commentId: string) {
    const post = await this.Post.findOne({ _id: postId }, { commentCount: 1 }).exec();
    if (!post) {
      throw new NotFoundException("Post Id not found");
    }

    await this.commentService.deleteComment(userId, userRole, commentId);

  }

  async getPublishedCommentOnPost(postId: string, lastId?: string) {
    const comments = await this.commentService.allPublishedCommentOnPost(postId, lastId);
    return comments;
  }

  async getAllRejectedComments(lastId?: string) {
    const comments = await this.commentService.allRejectedComment(lastId);
    return comments;
  }

  async getAllPublishedComments(lastId?: string) {
    const comments = await this.commentService.allPublishedComment(lastId);
    return comments;
  }

  async getAllDeletedComments(lastId?: string) {
    const comments = await this.commentService.allDeletedComment(lastId);
    return comments
  }

  async editComment(userId: string, userRole: string, commentId: string, message: string) {
    await this.commentService.editComment(userId, userRole, commentId, message)
  }

  async recoverComment(commentId: string){
    await this.commentService.recoverComment(commentId)
  }

}
