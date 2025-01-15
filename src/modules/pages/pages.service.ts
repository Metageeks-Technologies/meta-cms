import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePageDto } from "./dto/create-page.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IPage } from "./schema/page.schema";
import { UpdatePageDto } from "./dto/update-page.dto";



@Injectable()
export class PagesService {

    constructor(
        @InjectModel('Page') private Page: Model<IPage>
    ) { }


    async createPage(newPageDetails: CreatePageDto, authorId: string) {

        const newPage = new this.Page(newPageDetails);
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

    async getPageBySlug(slug: string, isDeleted?: boolean) {

        const matchCondition: any = {
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


    async deletePageById(id: string) {
        const page = await this.Page.findOne({ _id: id }, { isDeleted: 1 }).lean().exec();

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        if (page.isDeleted) {
            throw new BadRequestException('Page already deleted');
        }
        await this.Page.updateOne({ _id: id }, { isDeleted: true }).exec();
    }


    async recoverPage(id: string) {
        const page = await this.Page.findOne({ _id: id }, { isDeleted: 1 }).lean().exec();

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        if (!page.isDeleted) {
            throw new BadRequestException('Page not deleted yet');
        }
        await this.Page.updateOne({ _id: id }, { isDeleted: false }).exec();
    }

    async updatePage(id: string, updatePageDetails: UpdatePageDto) {
        const page = await this.Page.findOne({ _id: id }, { title: 1 }).exec();

        if (!page.title) {
            throw new NotFoundException('Page not found');
        }

        await this.Page.updateOne({ _id: id }, { $set: updatePageDetails }).exec();
    }

    async getAllPage(): Promise<any> {
        const allPage = await this.Page.find().sort({ createdAt: -1 }).lean().exec();

        if (!allPage.length) throw new NotFoundException('No page found')

        return allPage
    }

}