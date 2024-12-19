import { HttpException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILike } from './schema/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel('Like') private Like: Model<ILike>) { }

  // Assumes postId & userId exist and already verified by the caller
  async createLike(postId: string, userId: string) {
    const newLike = new this.Like({ userId, postId });
    try {
      await newLike.save();
    } catch(error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new HttpException('Already Liked', 400);
      }
      
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  // Assumes postId & userId exist and already verified by the caller
  async removeLike(postId: string, userId: string) {
    const query = await this.Like.deleteOne({ 
      userId: userId,
      postId: postId
    }).exec();

    if(query.deletedCount == 0){
      throw new HttpException('Post was not liked by the user', 400);
    }
  }

  async isPostLikedByUser(postId: string, userId: string) {
    const like = await this.Like.findOne({ postId: postId, userId: userId }).lean().exec();
    if(like)
      return true;
    else
      return false;
  }

}
