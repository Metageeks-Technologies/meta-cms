import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException, ParseBoolPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPost, PostStatusEnum } from './schema/post.schema';
import mongoose, { Model } from 'mongoose';
import { GetPostsQueryDto, PostSortByEnum } from './dto/get-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { slugify } from 'src/utils/slug';
import { UserRoleEnum } from '../users/schema/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { LikesService } from '../likes/likes.service';
import { SearchPostSortByEnum, SearchPostsQueryDto } from './dto/search-post.dto';

@Injectable()
export class PostsService {
  private readonly POST_BATCH_LIMIT = 10;
  private readonly postAggregationFinalSteps = [
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
        'authorId': 0,
        'author.hash': 0,
        'author.__v': 0,
      },
    }
  ];
  constructor(@InjectModel('Post') private Post: Model<IPost>, private likesService: LikesService) { }

  async createUniqueSlugFromTitle(title: string) {
    const noOfPostWithSameTitle = await this.Post.countDocuments({ title: title });
    if (noOfPostWithSameTitle == 0) {
      return slugify(title);
    }
    return `${slugify(title)}-${noOfPostWithSameTitle}`;
  }

  // Assumes authorId is coming from JWT and is verified by RolesGuard.
  // Hence we are not checking if id is valid or not
  // Also assuming ids in categories are valid
  // The request can contain only 3 statuses (See DTO): Published, Scheduled, or Draft. Rest will be maintained internally
  async createPost(newPostData: CreatePostDto, authorId: string, authorRole: UserRoleEnum) {
    const newPost = new this.Post(newPostData);
    newPost.authorId = mongoose.Types.ObjectId.createFromHexString(authorId);
    newPost.slug = await this.createUniqueSlugFromTitle(newPost.title);

    // If contributor creates a post to be published/scheduled, change its status to 'awaiting approval'
    if (authorRole === UserRoleEnum.CONTRIBUTOR && (newPost.status === PostStatusEnum.PUBLISHED || newPost.status === PostStatusEnum.SCHEDULED)) {
      newPost.status = PostStatusEnum.AWAITING_APPROVAL;
    }

    await newPost.save();
  }

  async getPosts(
    status: PostStatusEnum,
    isDeleted: boolean,
    authorId: string,
    tags: string[],
    categories: string[],
    sortBy: string,
    lastId: string,
    lastLikesCount: number
  ) {
    const pipeline: mongoose.PipelineStage[] = [];

    /////////////////////////////////////////
    // Match stage
    /////////////////////////////////////////
    const matchStage: Record<string, any> = {};
    if (status) {
      matchStage.status = status;
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
    const sortStage: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case PostSortByEnum.OLDEST:
        sortStage._id = 1;
        break;

      case PostSortByEnum.RECENT:
        sortStage._id = -1;
        break;

      case PostSortByEnum.POPULAR:
        // Order of insertion is important here
        sortStage.likesCount = -1;
        sortStage._id = -1;
        break;
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
    pipeline.concat(this.postAggregationFinalSteps);

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
    pipeline.concat(this.postAggregationFinalSteps);

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
    if(userRole == UserRoleEnum.CONTRIBUTOR && post.author._id !=userId) {
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
      if (mongoose.Types.ObjectId.createFromHexString(authorId) != post.authorId) {
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

  async isPostLikedByUser(postId: string, userId: string) {
    // Not checking existence of post here. 
    // Since if post does not exists, its corresponding like entries will not be in the likes collection
    // Just return true if correspoding like is found, otherwise false in all other cases
    return await this.likesService.isPostLikedByUser(postId, userId);
  }

  async deletePost(_id: string, userId: string, userRole: string) {
    const post = await this.Post.findOne({ _id: _id }, { authorId: 1, isDeleted: 1 }).lean().exec();
    if(!post) {
      throw new NotFoundException('Post ID not found');
    }

    // If contributor tries to delete other users' post
    if(userRole == UserRoleEnum.CONTRIBUTOR && post.authorId != mongoose.Types.ObjectId.createFromHexString(userId)) {
      throw new ForbiddenException();
    }

    if(post.isDeleted) {
      throw new BadRequestException("Post already deleted");
    }

    const query = await this.Post.updateOne({ _id: _id }, { isDeleted: true }).exec();
  }

  // Can only be done by superadmin
  async recoverPost(_id: string) {
    const query = await this.Post.updateOne({ _id: _id }, { isDeleted: true }).exec();
    if(query.matchedCount == 0) {
      throw new NotFoundException('Post ID not found');
    }

    if(query.modifiedCount == 0) {
      throw new BadRequestException('Post was not deleted');
    }
  }
}
