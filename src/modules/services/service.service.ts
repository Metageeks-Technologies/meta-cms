import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IService } from './schema/service.schema';
import { CreateServiceDto } from './dto/create-service-dto';
import { WebsiteService } from '../website/website.service';
import { UpdateServiceDto } from './dto/update-service-dto';

@Injectable()
export class ServiceService {

  private readonly SERVICE_PAGE_BATCH_LIMIT = 10;

  constructor(
    @InjectModel("Service") private Service: Model<IService>,
    private readonly websiteService: WebsiteService
  ) { }

  async create(websiteKey: string, newService: CreateServiceDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }


    const service = await this.findSubserviceByName(websiteKey, newService.name);
    if (service) {
      throw new ConflictException('Service name already exists');
    }

    const createdService = new this.Service({
      ...newService,
      key: newService.name.trim().toLowerCase().replace(/\s+/g, '_'),
      websiteKey: websiteKey
    });

    await createdService.save();
  }

  async updateService(websiteKey: string, serviceId: string, serviceDetails: UpdateServiceDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const service = await this.findSubserviceByName(websiteKey, serviceDetails.name);
    if (service) {
      throw new ConflictException('Service name already exists');
    }

    serviceDetails['key'] = serviceDetails.name.trim().toLowerCase().replace(/\s+/g, '_');

    const query = await this.Service.updateOne({ _id: serviceId, websiteKey }, { $set: { ...serviceDetails } });

    if (query.matchedCount === 0) {
      throw new NotFoundException('Service not found');
    }

  }

  async deleteService(websiteKey: string, serviceId: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const query = await this.Service.updateOne(
      { _id: serviceId, websiteKey },
      { isDeleted: true },
    );

    if (query.matchedCount === 0) {
      throw new NotFoundException('Service not found');
    }
  }

  // Recover (restore) a service
  async recoverService(websiteKey: string, serviceId: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const query = await this.Service.updateOne(
      { _id: serviceId, websiteKey },
      { isDeleted: false },
    );

    if (query.matchedCount === 0) {
      throw new NotFoundException('Service not found');
    }

  }

  // In ServiceService
  async findAll(websiteKey: string, pageNo: string, searchQuery: string, isDeleted?: boolean) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const query = { websiteKey };
    let sortOption: any = { createdAt: -1 }

    if (searchQuery) {
      query['$text'] = { $search: searchQuery }
      sortOption = { score: { $meta: "textScore" }, createdAt: -1 }
    }

    if (isDeleted !== undefined) {
      query['isDeleted'] = isDeleted;
    }

    if (pageNo) {
      const page = parseInt(pageNo) || 1;
      const skip = (page - 1) * this.SERVICE_PAGE_BATCH_LIMIT

      const services = await this.Service.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(this.SERVICE_PAGE_BATCH_LIMIT)
        .select(searchQuery && { score: { $meta: "textScore" } })
        .lean().exec();

      return services;
    } else {

      const services = await this.Service.find(query)
        .sort({ createdAt: -1 })
        .lean().exec();

      return services

    }

  }


  async finById(websiteKey: string, id: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new BadRequestException('Invalid website key')
    }

    const service = await this.Service.findOne({ _id: id, websiteKey }).exec();
    return service;
  }

  async findSubserviceByName(websiteKey: string, name: string) {
    const service = this.Service.findOne({ websiteKey, name }).exec();
    return service;
  }

  async getServiceByKey(websiteKey: string, key: string) {
    const service = await this.Service.findOne({ websiteKey, key }).exec();
    return service;
  }

}
