import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CommentStatusEnum, IComment } from "./schema/comment.schema";
import { UserRoleEnum } from "../users/schema/user.schema";


@Injectable()
export class CommentService {
  constructor(@InjectModel('Comment') private Comment: Model<IComment>) { }

  async createNewComment(postId: string, userId: string, message: string) {
    const newComment = await this.Comment.create({
      userId,
      postId,
      message
    });

  }

  async approveComment(commentId: string) {

    const approvedComment = await this.Comment.findOneAndUpdate(
      { _id: commentId },
      { status: CommentStatusEnum.PUBLISHED },
      { new: true }
    );

    if (!approvedComment) {
      throw new NotFoundException('Comment not found');
    }
  }

  async rejectComment(commentId: string) {
    const rejectedComment = await this.Comment.findOneAndUpdate(
      { _id: commentId },
      { status: CommentStatusEnum.REJECTED },
      { new: true }
    );

    if (!rejectedComment) {
      throw new NotFoundException('Comment not found');
    }

  }

  async awaitingApproveComment() {
    try {

      const pipeline: mongoose.PipelineStage[] = [];

      const matchStage: Record<string, any> = {
        status: CommentStatusEnum.AWAITING_APPROVAL,
        isDeleted: { $ne: true }
      };

      pipeline.push({ $match: matchStage });

      pipeline.push({
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postDetails'
        }
      });

      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      });

      pipeline.push({
        $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
      });
      pipeline.push({
        $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }
      });

      const awaitingComments = await this.Comment.aggregate(pipeline).exec();

      return awaitingComments;
    } catch (error) {
      throw error
    }
  }

  async deleteComment(userId: string, userRole: string, commentId: string) {
    const comment = await this.Comment.findOne({ _id: commentId });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }


    // Check if the user is authorized to delete the comment
    const isOwner = comment.userId.toString() === userId;
    const isAuthorized = userRole === UserRoleEnum.SUPERADMIN || userRole === UserRoleEnum.MODERATOR;

    if (!isOwner && !isAuthorized) {
      throw new ForbiddenException("You do not have permission to delete this comment");
    }

    await this.Comment.findOneAndUpdate({ _id: commentId }, { isDeleted: true });
  }

  async allPublishedCommentOnPost(postId: string, lastId?: string) {
    const pipeline: mongoose.PipelineStage[] = [];

    // Match stage
    const matchStage: Record<string, any> = {
      postId: mongoose.Types.ObjectId.createFromHexString(postId), // Match the specific post ID
      status: CommentStatusEnum.PUBLISHED, // Ensure the comments are published
      isDeleted: { $ne: true } // Exclude deleted comments
    };

    if (lastId) {
      matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    pipeline.push({ $match: matchStage });

    // Sorting stage
    const sortStage: Record<string, 1 | -1> = { _id: -1 }; // Sort by most recent comments first
    pipeline.push({ $sort: sortStage });

    // Limit stage
    const LIMIT = 10; // Fetch 10 comments per batch
    pipeline.push({ $limit: LIMIT });


    pipeline.push({
      $lookup: {
        from: 'users', // The collection you want to join (users)
        localField: 'userId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'userDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({
      $lookup: {
        from: 'posts', // The collection you want to join (users)
        localField: 'postId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'postDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({ $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
    });

    pipeline.push({
      $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
    });

    // Execute the aggregation pipeline
    const comments = await this.Comment.aggregate(pipeline).exec();
    return comments;
  }

  async allRejectedComment(lastId?: string) {
    const pipeline: mongoose.PipelineStage[] = [];

    // Match stage
    const matchStage: Record<string, any> = {
      status: CommentStatusEnum.REJECTED, // Ensure the comments are rejected
      isDeleted: { $ne: true } // Exclude deleted comments
    };

    if (lastId) {
      matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    pipeline.push({ $match: matchStage });

    // Sorting stage
    const sortStage: Record<string, 1 | -1> = { _id: -1 }; // Sort by most recent comments first
    pipeline.push({ $sort: sortStage });

    // Limit stage
    const LIMIT = 10; // Fetch 10 comments per batch
    pipeline.push({ $limit: LIMIT });


    pipeline.push({
      $lookup: {
        from: 'users', // The collection you want to join (users)
        localField: 'userId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'userDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({
      $lookup: {
        from: 'posts', // The collection you want to join (users)
        localField: 'postId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'postDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({ $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
    });

    // Execute the aggregation pipeline
    const comments = await this.Comment.aggregate(pipeline).exec();
    return comments;
  }

  async allPublishedComment(lastId?: string) {
    const pipeline: mongoose.PipelineStage[] = [];

    // Match stage
    const matchStage: Record<string, any> = {
      status: CommentStatusEnum.PUBLISHED, // Ensure the comments are published
      isDeleted: { $ne: true } // Exclude deleted comments
    };

    if (lastId) {
      matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    pipeline.push({ $match: matchStage });

    // Sorting stage
    const sortStage: Record<string, 1 | -1> = { _id: -1 }; // Sort by most recent comments first
    pipeline.push({ $sort: sortStage });

    // Limit stage
    const LIMIT = 10; // Fetch 10 comments per batch
    pipeline.push({ $limit: LIMIT });


    pipeline.push({
      $lookup: {
        from: 'users', // The collection you want to join (users)
        localField: 'userId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'userDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({
      $lookup: {
        from: 'posts', // The collection you want to join (users)
        localField: 'postId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'postDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({ $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
    });

    // Execute the aggregation pipeline
    const comments = await this.Comment.aggregate(pipeline).exec();
    return comments;
  }

  async allDeletedComment(lastId?: string) {
    const pipeline: mongoose.PipelineStage[] = [];

    // Match stage
    const matchStage: Record<string, any> = {
      isDeleted: true // include deleted comments
    };

    if (lastId) {
      matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    pipeline.push({ $match: matchStage });

    // Sorting stage
    const sortStage: Record<string, 1 | -1> = { _id: -1 }; // Sort by most recent comments first
    pipeline.push({ $sort: sortStage });

    // Limit stage
    const LIMIT = 10; // Fetch 10 comments per batch
    pipeline.push({ $limit: LIMIT });


    pipeline.push({
      $lookup: {
        from: 'users', // The collection you want to join (users)
        localField: 'userId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'userDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({
      $lookup: {
        from: 'posts', // The collection you want to join (users)
        localField: 'postId', // The field in your comment collection
        foreignField: '_id', // The field in the users collection
        as: 'postDetails', // The name of the new field to store the populated data
      },
    });

    pipeline.push({ $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $unwind: { path: '$postDetails', preserveNullAndEmptyArrays: true }
    });

    // Execute the aggregation pipeline
    const comments = await this.Comment.aggregate(pipeline).exec();
    return comments;
  }

  async editComment(userId: string, userRole: string, commentId: string, message: string) {

    const comment = await this.Comment.findOne({ _id: commentId }, { userId: 1 }).lean().exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (userRole == UserRoleEnum.CONTRIBUTOR) {
      // If a contributor tries to update post of someone else
      if (userId != comment.userId.toString()) {
        throw new ForbiddenException();
      }
    }

    const query = await this.Comment.updateOne({ _id: commentId }, { message, status: CommentStatusEnum.AWAITING_APPROVAL }).lean().exec();

  }

  async recoverComment(commentId: string) {
    const comment = await this.Comment.findOneAndUpdate({ _id: commentId }, { isDeleted: false });

    if(!comment){
      throw new NotFoundException('Comment not found');
    }
  }

}