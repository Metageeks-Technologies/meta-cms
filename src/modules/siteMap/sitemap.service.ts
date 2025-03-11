import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISiteMap } from "./schema/sitemap.schema";
import { PagesService } from "../pages/pages.service";
import { CaseStudyService } from "../caseStudy/caseStudy.service";
import { PostsService } from "../posts/posts.service";
import { WebsiteService } from "../website/website.service";
import { RedisService } from "../redis/redis.service";
import * as fs from 'fs';
import { Builder } from 'xml2js';
import * as path from "path";
import { Response } from "express";




@Injectable()
export class SitemapService {



    private sendXmlResponse(urls: any[], res: Response, websiteKey: string) {
        const sitemapObj = {
            urlset: {
                $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
                url: urls,
            },
        };

        const builder = new Builder();
        const xml = builder.buildObject(sitemapObj);

        const filePath = path.join(__dirname, `../../${websiteKey}.xml`);
        fs.writeFileSync(filePath, xml);


        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', `attachment; filename="${websiteKey}-sitemap.xml"`);
        res.send(xml);

        // 🗑 Delete file from server after sending
        setTimeout(() => {
            const filePath = path.join(__dirname, `../../${websiteKey}.xml`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }, 5000);
    }



    constructor(
        @InjectModel('Sitemap') private Sitemap: Model<ISiteMap>,
        @Inject(forwardRef(() => PagesService)) private readonly pageService: PagesService,
        @Inject(forwardRef(() => CaseStudyService)) private readonly caseStudyService: CaseStudyService,
        @Inject(forwardRef(() => PostsService)) private readonly postService: PostsService,
        @Inject(forwardRef(() => WebsiteService)) private readonly websiteService: WebsiteService,
        @Inject(forwardRef(() => RedisService)) private readonly redisService: RedisService,
    ) { }


    async getSitemap(websiteKey: string, res: Response) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new NotFoundException("Invalid website key")
        }


        // check sitemap in redis 
        const redisSitemap = await this.redisService.getCache(`${website.domain}_${websiteKey}`)
        if (redisSitemap) {
            return this.sendXmlResponse(JSON.parse(redisSitemap), res, websiteKey)
        }


        const siteMapInDB = await this.Sitemap.findOne({ websiteKey })
        if (siteMapInDB) {
            await this.redisService.setCache(`${website.domain}_${websiteKey}`, siteMapInDB.sitemap, 86400)

            return this.sendXmlResponse(JSON.parse(siteMapInDB.sitemap), res, websiteKey)
        }

        const urls = await this.createSitemap(websiteKey);

        return this.sendXmlResponse(urls, res, websiteKey)

    }


    async createSitemap(websiteKey: string) {
        try {
            const website = await this.websiteService.getWebsiteByKey(websiteKey)
            if (!website) {
                throw new BadRequestException("Invalid website key");
            }

            const allPages = await this.pageService.getAllPageWithoutPagination(websiteKey);
            const allCaseStudy = await this.caseStudyService.getAllCaseStudyWithoutPagination(websiteKey);
            const allBlogs = await this.postService.getAllPostWithoutPagination(websiteKey);

            const urls = [];
            allPages.forEach((pageData) => {
                urls.push({
                    loc: `${website.domain}/${pageData.slug}`,
                    lastmod: pageData.updatedAt.toISOString(),
                    changefreq: 'monthly',
                    priority: 1.0
                })
            });


            allCaseStudy.forEach((caseStudyData) => {
                urls.push({
                    loc: `${website.domain}/case-study/${caseStudyData.slug}`,
                    lastmod: caseStudyData.updatedAt.toISOString(),
                    changefreq: 'monthly',
                    priority: 0.8
                })
            });


            allBlogs.forEach((blogs) => {
                urls.push({
                    loc: `${website.domain}/blogs/${blogs.slug}`,
                    lastmod: blogs.updatedAt.toISOString(),
                    changefreq: 'weekly',
                    priority: 0.6
                })
            });

            const isExist = this.Sitemap.findOne({ websiteKey });

            if (isExist) {
                await this.Sitemap.updateOne({ websiteKey }, { $set: { sitemap: JSON.stringify(urls) } });
            } else {
                await this.Sitemap.create({ websiteKey, sitemap: JSON.stringify(urls) });
            }

            await this.redisService.setCache(`${website.domain}_${websiteKey}`, JSON.stringify(urls), 86400);
            return urls
        } catch (error) {
            console.log("Error in creating sitemap : ", error)
            throw new error;
        }
    }

}