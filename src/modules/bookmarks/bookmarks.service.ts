import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { IBookmark } from './schema/bookmark.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GetUserBookmarksQueryDto } from '../users/dto/get-user-bookmarks.dto';

@Injectable()
export class BookmarksService {
  private readonly BOOKMARK_BATCH_LIMIT = 10;
  constructor(@InjectModel('Bookmark') private Bookmark: Model<IBookmark>) { }

  async add(postId: string, userId: string) {
    // Assumes postId and userId are already verified by caller
    const newBookmark = new this.Bookmark({ userId, postId });
    try {
      await newBookmark.save();
    } catch(error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Already Bookmarked');
      }
      
      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async remove(postId: string, userId: string) {
    // No need to validate for postId and userId here
    // If they are valid and their corresponding bookmark exists, we'll delete it
    // If their corresponding bookmark does not exist, or even if they are invalid, a not found exception is thrown
    const query = await this.Bookmark.deleteOne({ postId: postId, userId: userId}).exec();
    if(query.deletedCount == 0) {
      throw new NotFoundException("Bookmark not found");
    }
  }

  async isPostBookmarkedByUser(postId: string, userId: string) {
    // No need to validate for postId and userId here
    // If they are valid and their corresponding bookmark exists, we'll return true
    const bookmark = await this.Bookmark.findOne({ postId: postId, userId: userId }, { _id: 1 }).lean().exec();
    if(bookmark) {
      return true;
    } else {
      return false;
    }
  }

  async getUserBookmarks(userId: string, { lastId }: GetUserBookmarksQueryDto) {
    // Assuming userId is valid and verified by JWT
    // Not looking up userId bacause the client is supposed to know for which user it is fetching bookmarks
    const bookmarks = this.Bookmark.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          ...(lastId 
                ? { _id: { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) } }
                : {}
          )
        }
      },
      {
        $sort: {
          _id: -1
        }
      },
      {
        $limit: this.BOOKMARK_BATCH_LIMIT
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'post'
        }
      },
      {
        $unwind: '$post'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'post.categories',
          foreignField: '_id',
          as: 'post.categories',
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'post.authorId',
          foreignField: '_id',
          as: 'post.author',
        }
      },
      {
        $unwind: "$post.author",
      },
      {
        $project: {
          'postId': 0,
          'post.authorId': 0,
          'post.author.hash': 0,
        },
      }
    ]).exec();
    
    return bookmarks;
  }


}
