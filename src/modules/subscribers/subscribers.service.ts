import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { ISubscriber } from './schema/subscriber.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GetSubscribersQueryDto } from './dto/get-subscribers.dto';

@Injectable()
export class SubscribersService {
  private readonly SUBSCRIBERS_BATCH_LIMIT = 10;
  constructor(@InjectModel('Subscriber') private Subscriber: Model<ISubscriber>) { }

  async addSubscriber({ email }: CreateSubscriberDto) {
    const subscriber = new this.Subscriber({ email });
    try {
      await subscriber.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Already subscribed');
      }

      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async getSubscribers( { lastId } : GetSubscribersQueryDto): Promise<any[]>{
    const query: any = {};
    
    // If `lastId` is provided, fetch subscribers created before it
    if (lastId) {
      query._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    // Fetch subscribers sorted by creation date in descending order
    const subscribers = await this.Subscriber.find(query)
      .sort({ _id: -1 }) // Most recent first
      .limit(this.SUBSCRIBERS_BATCH_LIMIT).lean().exec();

    return subscribers;
  }

  // To be called when admin request all subscribers to be imported to an excel sheet 
  // Strips away all fields except email
  async getAllSubscribers(): Promise<any[]>{
    const subscribers = await this.Subscriber.find({}, { _id: 0, email: 1}).sort({ _id: -1 }).lean().exec();
    return subscribers;
  }
}
