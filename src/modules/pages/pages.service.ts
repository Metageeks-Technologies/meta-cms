import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePageDto } from "./dto/create-page.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IPage, PageServiceEnum, PageSubServiceEnum } from "./schema/page.schema";
import { UpdatePageDto } from "./dto/update-page.dto";
import { WebsiteService } from "../website/website.service";
import { ServiceService } from "../services/service.service";
import { SubserviceService } from "../subservices/subservice.service";



@Injectable()
export class PagesService {
    private readonly PAGE_BATCH_LIMIT = 10;

    constructor(
        @InjectModel('Page') private Page: Model<IPage>,
        private readonly websiteService: WebsiteService,
        private readonly serviceService: ServiceService,
        private readonly subserviceService: SubserviceService
    ) { }


    async createPage(websiteKey: string, newPageDetails: CreatePageDto, authorId: string) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const service = await this.serviceService.getServiceByKey(websiteKey, newPageDetails.service);
<<<<<<< Updated upstream
        if (!service) {
=======
<<<<<<< Updated upstream
        if (!service) {
=======
        if(!service){
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            throw new BadRequestException('Invalid Service');
        }

        const subService = await this.subserviceService.getSubServiceByKey(websiteKey, newPageDetails.subService);
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        if (!subService) {
            throw new BadRequestException('Invalid Sub Service');
        }

        const page = await this.Page.findOne({ website: websiteKey, slug: newPageDetails.slug }).exec();
        if (page) {
<<<<<<< Updated upstream
=======
=======
        if(!subService){
            throw new BadRequestException('Invalid Sub Service');
        }

        const page = await this.Page.findOne({website: websiteKey, slug: newPageDetails.slug}).exec();
        if(page){
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            throw new BadRequestException('Slug already exists');
        }

        const newPage = new this.Page(newPageDetails);
        newPage.website = websiteKey;
        newPage.authorId = mongoose.Types.ObjectId.createFromHexString(authorId);

        try {
            await newPage.save();
        } catch (error) {
            throw error;
        }
    }

    async getPageBySlug(websiteKey: string, slug: string, isDeleted?: boolean) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const matchCondition: any = {
            website: websiteKey,
            slug: slug
        };

        if (isDeleted !== undefined) {
            matchCondition.isDeleted = isDeleted;
        }

        const result = await this.Page.aggregate([
            {
                $match: matchCondition
            }
        ]).exec();

        const page = result[0];
        if (!page) {
            throw new NotFoundException('Page Not Found')
        }
        return page;
    }


    async deletePageById(websiteKey: string, id: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const page = await this.Page.findOne({ _id: id, website: websiteKey }, { isDeleted: 1 }).lean().exec();

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        if (page.isDeleted) {
            throw new BadRequestException('Page already deleted');
        }
        await this.Page.updateOne({ _id: id }, { isDeleted: true }).exec();
    }


    async recoverPage(websiteKey: string, id: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const page = await this.Page.findOne({ _id: id, website: websiteKey }, { isDeleted: 1 }).lean().exec();
        if (!page) {
            throw new NotFoundException('Page not found');
        }
        if (!page.isDeleted) {
            throw new BadRequestException('Page not deleted yet');
        }
        await this.Page.updateOne({ _id: id }, { isDeleted: false }).exec();
    }

    async updatePage(websiteKey: string, id: string, updatePageDetails: UpdatePageDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const page = await this.Page.findOne({ _id: id, website: websiteKey }, { title: 1, slug: 1 }).exec();

        if (!page.title) {
            throw new NotFoundException('Page not found');
        }

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        const pageExist = await this.Page.findOne({ website: websiteKey, slug: updatePageDetails.slug, _id: { $ne: id } }).exec();
        if (pageExist) {
            throw new BadRequestException('Slug already exists')
        }

        const service = await this.serviceService.getServiceByKey(websiteKey, updatePageDetails.service);
        console.log(service,  "servcie");
        if (updatePageDetails.service && !service) {
<<<<<<< Updated upstream
=======
=======
        const pageExist = await this.Page.findOne({website: websiteKey, slug: updatePageDetails.slug}).exec();
        if(pageExist){
            throw new BadRequestException('Slug already exists')
        }        

        const service = await this.serviceService.getServiceByKey(websiteKey, updatePageDetails.service);
        if(updatePageDetails.service && !service){
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            throw new BadRequestException('Invalid Service');
        }

        const subService = await this.subserviceService.getSubServiceByKey(websiteKey, updatePageDetails.subService);
<<<<<<< Updated upstream
        console.log(subService, "SUb service")
        if (updatePageDetails.subService && !subService) {
=======
<<<<<<< Updated upstream
        console.log(subService, "SUb service")
        if (updatePageDetails.subService && !subService) {
=======
        if(updatePageDetails.subService && !subService){
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            throw new BadRequestException('Invalid Sub Service');
        }

        await this.Page.updateOne({ _id: id }, { $set: updatePageDetails }).exec();
    }

<<<<<<< Updated upstream
    async getAllPage(websiteKey: string, pageNo: string) {
=======
<<<<<<< Updated upstream
    async getAllPage(websiteKey: string, pageNo: string) {
=======
    async getAllPage(websiteKey: string) {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const page = parseInt(pageNo) || 1
        const skip = (page - 1) * this.PAGE_BATCH_LIMIT;

        const allPage = await this.Page.find({ website: websiteKey })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(this.PAGE_BATCH_LIMIT)
            .lean()
            .exec();


        return allPage
    }

    async getPageTitles(websiteKey: string, service: PageServiceEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const query = { website: websiteKey, service, isDeleted: false }

        const pages = await this.Page.find(query, { subService: 1, title: 1, slug: 1 });

        const result: Record<string, Record<string, { title: string; slug: string }[]>> = {
            [service]: {},
        };

        for (const page of pages) {
            const { subService, title, slug } = page;

            if (!result[service][subService]) {
                result[service][subService] = [];
            }

            result[service][subService].push({ title, slug });
        }

        return result;
    }

}