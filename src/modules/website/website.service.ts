import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IWebsite } from "./schema/website.schema";
import { AddWebSiteDto } from "./dto/create-website-dto";
import { UpdateWebsiteDto } from "./dto/update-website-dto";



@Injectable()
export class WebsiteService {
    constructor(
        @InjectModel('Website') private Website: Model<IWebsite>
    ) { }


    async addWebsite(newWebsiteDetails: AddWebSiteDto) {
        const newWebsite = new this.Website(newWebsiteDetails);

        try {
            await newWebsite.save()
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Website key already exists');
            }

            // Re-throw the error if it's not a duplicate key error
            throw error;
        }
    }

    async getWebsites(isDeleted: boolean) {
        const query = {}
        if(isDeleted !== undefined){
            query['isDeleted'] = isDeleted;
        }
        const websites = await this.Website.find(query).sort({ createdAt: -1 }).lean().exec();
        return websites;
    }

    async getWebsiteByKey(key: string) {
        const website = await this.Website.find({key}).lean().exec();
        return website;
    }

    async deleteWebsite(websiteId: string) {
        const query = await this.Website.updateOne({ _id: websiteId }, { isDeleted: true });
        if (query.matchedCount == 0) {
            throw new BadRequestException('Not Found');
        }
    }

    async recoverWebsite(websiteId: string) {
        const query = await this.Website.updateOne({ _id: websiteId }, { isDeleted: false })
        if (query.matchedCount == 0) {
            throw new BadRequestException('Not Found');
        }
    }

    async updateWebsite(websiteId: string, websiteDetails: UpdateWebsiteDto) {
        const query = await this.Website.updateOne({ _id: websiteId }, { $set: websiteDetails });
        if (query.matchedCount == 0) {
            throw new BadRequestException('Not Found');
        }
    }

}