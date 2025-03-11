import { Controller, Get, Headers, Res } from "@nestjs/common";
import { RSSService } from "./rss.service";
import { Response } from "express";




@Controller('rss')
export class RSSController {

    constructor(
        private readonly rssService: RSSService
    ) { }


    @Get('public')
    async getPublicRSS(@Headers('websiteKey') websiteKey: string, @Res() res: Response) {
        await this.rssService.getRssFeed(websiteKey, res)
    }

}