import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './schema/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) {}

  async create(createServiceDto: CreateServiceDto, websiteKey: string): Promise<Service> {
    const createdService = new this.serviceModel({
      ...createServiceDto,  // Spread the DTO fields
      websiteKey: websiteKey  // Add websiteKey from the header
    });
    return createdService.save();
  }

  async softDelete(serviceId: string): Promise<Service> {
    const service = await this.serviceModel.findByIdAndUpdate(
      serviceId,
      { deletedAt: new Date() },
      { new: true }
    );
    return service;
  }

  // Recover (restore) a service
  async recover(serviceId: string): Promise<Service> {
    const service = await this.serviceModel.findByIdAndUpdate(
      serviceId,
      { deletedAt: null },
      { new: true }
    );
    return service;
  }

  // In ServiceService
async findAll(): Promise<Service[]> {
    return this.serviceModel.find({ deletedAt: null }).exec();
  }
  

  async findOne(id: string): Promise<Service> {
    return this.serviceModel.findById(id).exec();
  }
}
