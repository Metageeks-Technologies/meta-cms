import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { IMedia } from './schema/media.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetMediaQueryDto } from './dto/get-media.dto';
import { v4 } from 'uuid';
import { GetSignedUploadUrlDTO } from './dto/get-signed-upload-url.dto';
import { WebsiteService } from '../website/website.service';

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

  constructor(
    @InjectModel('Media') private Media: Model<IMedia>,
    private readonly websiteService: WebsiteService
  ) { }

  async getSignedUploadUrl(websiteKey: string, { folderName, fileName, contentType }: GetSignedUploadUrlDTO) {

    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid Website key')
    }

    // Throw exception if contentType is not allowed
    if (!this.allowedContentTypes.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} is not allowed.`);
    }

    const key = `${folderName}/${v4()}`;

    const command = new PutObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}`,
      Key: key,
      ContentType: contentType,
    });

    let uploadUrl: string;
    try {
      uploadUrl = await getSignedUrl(this.s3Instance, command, { expiresIn: this.signedUrlExpirationTime });
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException('Error creating upload url');
    }

    return { uploadUrl, key };
  }

  async addMedia(websiteKey: string, { folderName, fileName, contentType, key }: CreateMediaDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid Website key')
    }

    const newMedia = new this.Media({ folderName, fileName, contentType, key, websiteKey });
    try {
      await newMedia.save();
    } catch (error) {
      console.log(error)
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Media key already exists');
      }

      // Re-throw the error if it's not a duplicate key error
      throw error;
    }
  }

  async getMedia(websiteKey: string, { lastId }: GetMediaQueryDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid Website key')
    }

    const query: any = { websiteKey };

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