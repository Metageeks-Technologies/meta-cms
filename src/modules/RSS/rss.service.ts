import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IRSS } from "./schema/rss.schema";
import { PostsService } from "../posts/posts.service";
import { WebsiteService } from "../website/website.service";
import { RedisService } from "../redis/redis.service";
import * as path from "path";
import * as fs from "fs"
import { Response } from "express";
import { Builder } from "xml2js";



@Injectable()
export class RSSService {

    private sendXmlResponse(xmlData: string, res: Response, websiteKey: string) {
        const filePath = path.join(__dirname, `../../${websiteKey}-rss.xml`);
        fs.writeFileSync(filePath, xmlData, "utf8");

        res.setHeader("Content-Type", "application/xml");
        res.setHeader("Content-Disposition", `attachment; filename="${websiteKey}-rss.xml"`);
        res.send(xmlData);

        setTimeout(() => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }, 5000);
    }

    private htmlToText(html: string): string {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    

    constructor(
        @InjectModel('RSS') private RSS: Model<IRSS>,
        @Inject(forwardRef(() => PostsService)) private readonly postService: PostsService,
        private readonly websiteService: WebsiteService,
        private readonly redisService: RedisService
    ) { }



    async getRssFeed(websiteKey: string, res: Response) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new NotFoundException("Invalid website key");
        }

        // Check RSS in Redis
        const redisRss = await this.redisService.getCache(`${website.domain}_${websiteKey}_rss`);
        if (redisRss) {
            return this.sendXmlResponse(redisRss, res, websiteKey);
        }

        // Check RSS in Database
        const rssInDB = await this.RSS.findOne({ websiteKey });
        if (rssInDB) {
            await this.redisService.setCache(`${website.domain}_${websiteKey}_rss`, rssInDB.rss, 86400);
            return this.sendXmlResponse(rssInDB.rss, res, websiteKey);
        }

        // Generate new RSS
        const xmlData = await this.createRssFeed(websiteKey);
        return this.sendXmlResponse(xmlData, res, websiteKey);
    }



    async createRssFeed(websiteKey: string) {
        try {
            const website = await this.websiteService.getWebsiteByKey(websiteKey);
            if (!website) {
                throw new BadRequestException("Invalid website key");
            }

            const allBlogs = await this.postService.getAllPostWithoutPagination(websiteKey);

            const rssObj = {
                rss: {
                    $: { version: "2.0" },
                    channel: {
                        title: website.name + " - Blog",
                        link: website.domain,
                        description: "Latest blog posts from " + website.name,
                        item: allBlogs.map((post) => ({
                            title: post.title,
                            link: `${website.domain}/blogs/${post.slug}`,
                            description: this.htmlToText(post.description) || "",
                            pubDate: new Date(post.updatedAt).toUTCString(),
                        })),
                    },
                },
            };

            const builder = new Builder();
            const xml = builder.buildObject(rssObj);

            const isExist = await this.RSS.findOne({ websiteKey });

            if (isExist) {
                await this.RSS.updateOne({ websiteKey }, { $set: { rss: xml } });
            } else {
                await this.RSS.create({ websiteKey, rss: xml });
            }

            await this.redisService.setCache(`${website.domain}_${websiteKey}_rss`, xml, 86400);    
            return xml;
        } catch (error) {
            console.log("Error in creating RSS feed:", error);
            throw error;
        }
    }

}