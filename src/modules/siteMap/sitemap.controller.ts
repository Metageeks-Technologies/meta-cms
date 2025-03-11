import { Controller, Get, Headers, Res } from "@nestjs/common";
import { SitemapService } from "./sitemap.service";
import { Response } from "express";





@Controller('sitemap')
export class SitemapController {
    
    constructor(private readonly sitemapService: SitemapService) { }


    @Get('public')
    async getWebsiteSiteMap(@Headers('websiteKey') websiteKey: string, @Res() res: Response) {
        await this.sitemapService.getSitemap(websiteKey, res)
    }

}