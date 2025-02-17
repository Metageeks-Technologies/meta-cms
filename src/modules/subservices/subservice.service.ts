import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISubservice } from './schema/subservice.schema';
import { CreateSubserviceDto } from './dto/create-subservice-dto';
import { WebsiteService } from '../website/website.service';
import { UpdateSubserviceDto } from './dto/update-subservice-dto';

@Injectable()
export class SubserviceService {
  constructor(
    @InjectModel('Subservice') private Subservice: Model<ISubservice>,
    private readonly websiteService: WebsiteService
  ) { }

  async create(websiteKey: string, newSubservice: CreateSubserviceDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key');
    }

    const subService = await this.findSubserviceByName(websiteKey, newSubservice.name)
    if (subService) {
      throw new ConflictException('Subservice name already exists')
    }

    const createdSubservice = new this.Subservice(
      {
        ...newSubservice,
        key: newSubservice.name.trim().toLowerCase().replace(/\s+/g, '_'),
        websiteKey: websiteKey
      });

    await createdSubservice.save();

  }

  async updateSubservice(websiteKey: string, subserviceId: string, subServiceDeatail: UpdateSubserviceDto) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key');
    }

    const subService = await this.findSubserviceByName(websiteKey, subServiceDeatail.name)
    if (subService) {
      throw new ConflictException('Subservice name already exists')
    }

    subServiceDeatail['key'] = subServiceDeatail.name.trim().toLowerCase().replace(/\s+/g, '_');

    const query = await this.Subservice.updateOne({ _id: subserviceId, websiteKey }, { $set: subServiceDeatail }).exec()

    if (query.matchedCount === 0) {
      throw new NotFoundException('Subservice not found');
    }
  }




  // Soft delete a subservice
  async deleteSubservice(websiteKey: string, subserviceId: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key')
    }

    const query = await this.Subservice.updateOne({ _id: subserviceId, websiteKey }, { isDeleted: true }).exec();

    if (query.matchedCount === 0) {
      throw new NotFoundException('Subservice not found')
    }

  }

  // Recover (restore) a subservice
  async recoverSubservice(websiteKey: string, subserviceId: string) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key')
    }
    const query = await this.Subservice.updateOne({ _id: subserviceId, websiteKey }, { isDeleted: false }).exec();

    if (query.matchedCount === 0) {
      throw new NotFoundException('Subservice not found')
    }

  }

  async findAll(websiteKey: string, isDeleted?: boolean) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key')
    }

    const query = {
      websiteKey
    }

    if (isDeleted !== undefined) {
      query['isDeleted'] = isDeleted;
    }

    const subservices = await this.Subservice.find(query).lean().exec()
    return subservices;
  }

  async findByServiceId(websiteKey: string, serviceId: string, isDeleted?: boolean) {
    const website = await this.websiteService.getWebsiteByKey(websiteKey);
    if (!website) {
      throw new NotFoundException('Invalid website key')
    }

    const query = {websiteKey, service: serviceId}

    if(isDeleted !== undefined){
      query['isDeleted'] = isDeleted
    }

    const subservices = await this.Subservice.find(query).lean().exec()
    return subservices;

  }


  async findSubserviceByName(websiteKey: string, name: string) {
    const subService = this.Subservice.findOne({ websiteKey, name }).exec();
    return subService;
  }

}
