import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePageDto } from "./dto/create-page.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IPage, PageServiceEnum, PageSubServiceEnum } from "./schema/page.schema";
import { UpdatePageDto } from "./dto/update-page.dto";
import { WebsiteService } from "../website/website.service";



@Injectable()
export class PagesService {

    constructor(
        @InjectModel('Page') private Page: Model<IPage>,
        private readonly websiteService: WebsiteService
    ) { }


    async createPage(websiteKey: string, newPageDetails: CreatePageDto, authorId: string) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const newPage = new this.Page(newPageDetails);
        newPage.website = websiteKey;
        newPage.authorId = mongoose.Types.ObjectId.createFromHexString(authorId);

        try {
            await newPage.save();
        } catch (error) {
            if (error.code === 11000) {
                //Duplicate key error
                throw new ConflictException('Slug already exists');
            }
            // Re-throw the error if it's not a duplicate key error
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

        const page = await this.Page.findOne({ _id: id, website: websiteKey }, { title: 1 }).exec();

        if (!page.title) {
            throw new NotFoundException('Page not found');
        }

        await this.Page.updateOne({ _id: id }, { $set: updatePageDetails }).exec();
    }

    async getAllPage(websiteKey: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException("Invalid website key");
        }

        const allPage = await this.Page.find({ website: websiteKey }).sort({ createdAt: -1 }).lean().exec();
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