import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { IMedia } from './schema/media.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetMediaQueryDto } from './dto/get-media.dto';
import { v4 } from 'uuid';
import { GetSignedUploadUrlDTO } from './dto/get-signed-upload-url.dto';

@Injectable()
export class MediaService {
  private readonly s3Instance = new S3Client({
    region: `${process.env.AWS_REGION}`,
    credentials: {
      accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
      secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
    },
  });
  private readonly signedUrlExpirationTime = 3600; // In seconds
  private readonly allowedContentTypes = [
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/png',
    'image/webp',
  ];
  private readonly MEDIA_BATCH_LIMIT = 10;

  constructor(@InjectModel('Media') private Media: Model<IMedia>) { }

  async getSignedUploadUrl({ folderName, fileName, contentType }: GetSignedUploadUrlDTO) {
    // Throw exception if contentType is not allowed
    if (!this.allowedContentTypes.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} is not allowed.`);
    }

    const key = `${folderName}/${v4()}`;

    const command = new PutObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}`,
      Key: key,
    });

    let uploadUrl: string;
    try {
      uploadUrl = await getSignedUrl(this.s3Instance, command, { expiresIn: this.signedUrlExpirationTime });
    } catch (err) {
      throw new InternalServerErrorException('Error creating upload url');
    }

    return { uploadUrl, key };
  }

  async addMedia({ folderName, fileName, contentType, key }: CreateMediaDto) {
    const newMedia = new this.Media({ folderName, fileName, contentType, key });
    try {
      await newMedia.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new HttpException('Media key already exists', 400);
      }

      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async getMedia( { lastId } : GetMediaQueryDto): Promise<any[]>{
    const query: any = {};
    
    // If `lastId` is provided, fetch media created before it
    if (lastId) {
      query._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
    }

    // Fetch media sorted by creation date in descending order
    const media = await this.Media.find(query)
      .sort({ _id: -1 }) // Most recent first
      .limit(this.MEDIA_BATCH_LIMIT).lean().exec();

    return media;
  }
}