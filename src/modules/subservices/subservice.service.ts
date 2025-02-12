import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subservice } from './schema/subservice.schema';
import { CreateSubserviceDto } from './dto/create-subservice.dto';

@Injectable()
export class SubserviceService {
  constructor(@InjectModel(Subservice.name) private subserviceModel: Model<Subservice>) {}

  async create(createSubserviceDto: CreateSubserviceDto, websiteKey: string): Promise<Subservice> {
    const createdSubservice = new this.subserviceModel({...createSubserviceDto,websiteKey: websiteKey });
    return createdSubservice.save();
  }

  // Soft delete a subservice
  async softDelete(subserviceId: string): Promise<Subservice> {
    const subservice = await this.subserviceModel.findByIdAndUpdate(
      subserviceId,
      { deletedAt: new Date() },
      { new: true },
    );
    return subservice;
  }
  
  // Recover (restore) a subservice
  async recover(subserviceId: string): Promise<Subservice> {
    const subservice = await this.subserviceModel.findByIdAndUpdate(
      subserviceId,
      { deletedAt: null },
      { new: true }
    );
    return subservice;
  }

  async findAll(): Promise<Subservice[]> {
    return this.subserviceModel.find({ deletedAt: null });
  }

  async findByServiceId(serviceId: string): Promise<Subservice[]> {
    return this.subserviceModel.find({ serviceId }).exec();
  }

}
