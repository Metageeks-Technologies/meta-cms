import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILike } from './schema/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel('Like') private Like: Model<ILike>) { }

  async createLike(postId: string, userId: string) {
    // Assumes postId & userId exist and already verified by the caller
    const newLike = new this.Like({ userId, postId });
    try {
      await newLike.save();
    } catch(error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Already Liked');
      }
      
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async removeLike(postId: string, userId: string) {
    // No need to validate for postId and userId here
    // If they are valid and their corresponding like exists, we'll delete it
    // If their corresponding like does not exist, or even if they are invalid, a not found exception is thrown
    const query = await this.Like.deleteOne({ 
      userId: userId,
      postId: postId
    }).exec();

    if(query.deletedCount == 0){
      throw new HttpException('Post was not liked by the user', 400);
    }
  }

  async isPostLikedByUser(postId: string, userId: string) {
    // No need to validate for postId and userId here
    // If they are valid and their corresponding like exists, we'll delete it
    // If their corresponding like does not exist, or even if they are invalid, a not found exception is thrown
    const like = await this.Like.findOne({ postId: postId, userId: userId }, { _id: 1}).lean().exec();
    if(like)
      return true;
    else
      return false;
  }

}
