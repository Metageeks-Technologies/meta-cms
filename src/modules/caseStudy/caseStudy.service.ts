import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ICaseStudy } from "./schema/caseStudy.schema";
import { UserRoleEnum } from "../users/schema/user.schema";
import { CreateCaseStudyDto } from "./dto/create-caseStudy-dto";
import { WebsiteService } from "../website/website.service";
import { UpdateCaseStudyDto } from "./dto/update-caseStudy.dto";



@Injectable()
export class CaseStudyService {
    constructor(
        @InjectModel('CaseStudy') private CaseStudy: Model<ICaseStudy>,
        private readonly websiteService: WebsiteService
    ) { }


    async create(websiteKey: string, userId: string, newCaseStudy: CreateCaseStudyDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const caseStudyExist = await this.CaseStudy.findOne({ websiteKey, slug: newCaseStudy.slug }).exec()
        if (caseStudyExist) {
            throw new BadRequestException('Slug already exists');
        }

        const caseStudy = new this.CaseStudy({ ...newCaseStudy, websiteKey, authorId: userId });
        await caseStudy.save();
    }

    async update(websiteKey: string, caseStudyId: string, updatedDetails: UpdateCaseStudyDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const caseStudyExist = await this.CaseStudy.findOne({ websiteKey, slug: updatedDetails.slug }).exec()
        if (updatedDetails.slug && caseStudyExist) {
            throw new BadRequestException('Slug already exists');
        }

        const query = await this.CaseStudy.updateOne({ _id: caseStudyId, websiteKey }, { $set: { ...updatedDetails } }).exec();

        if (query.matchedCount === 0) {
            throw new NotFoundException('Case study not found')
        }
    }

    async delete(websiteKey: string, caseStudyId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = await this.CaseStudy.updateOne({ _id: caseStudyId, websiteKey }, { isDeleted: true }).exec();

        if (query.matchedCount === 0) {
            throw new NotFoundException('Case study not found')
        }
    }


    async recover(websiteKey: string, caseStudyId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = await this.CaseStudy.updateOne({ _id: caseStudyId, websiteKey }, { isDeleted: false }).exec();

        if (query.matchedCount === 0) {
            throw new NotFoundException('Case study not found')
        }
    }

    async getAll(websiteKey: string, isDeleted?: boolean) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = { websiteKey }
        if (isDeleted !== undefined) {
            query['isDeleted'] = isDeleted;
        }

        const caseStudies = await this.CaseStudy.find(query).populate('authorId').exec()
        return caseStudies;
    }

    async getPublic(websiteKey: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const caseStudies = await this.CaseStudy.find({ websiteKey, isDeleted: false }, { title: 1, slug: 1, "content.heroSection": 1 }).exec()
        return caseStudies;
    }

    async getBySlug(websiteKey: string, slug: string, isDeleted?: boolean) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }
        const query = { websiteKey, slug };

        if(isDeleted !== undefined){
            query['isDeleted'] = isDeleted;
        }

        const caseStudy = await this.CaseStudy.findOne(query).populate('authorId').exec();
        return caseStudy;
    }

}