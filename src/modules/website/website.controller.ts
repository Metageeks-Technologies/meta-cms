import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { AddWebSiteDto } from "./dto/create-website-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateWebsiteDto } from "./dto/update-website-dto";
import { WebsiteQueryDto } from "./dto/get-website.dto";


@Controller('website')
export class WebsiteController {
    constructor(private readonly websiteService: WebsiteService) { }


    // @Post()
    // @AllowedRoles(UserRoleEnum.SUPERADMIN)
    // @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    // @UseGuards(AuthGuard, RolesGuard, StoreRolesGuard)
    // async addWebsite(@Body() newWebsiteDetails: AddWebSiteDto) {
    //     await this.websiteService.addWebsite(newWebsiteDetails);
    //     return { message: "Website add successfully" }
    // }

    @Get()
    @UseGuards(AuthGuard)
    async getWebsites(@Query() query: WebsiteQueryDto) {
        const websites = await this.websiteService.getWebsites(false, query.page)
        return websites;
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllWebsites(@Query() query: WebsiteQueryDto) {
        const websites = await this.websiteService.getWebsites(undefined, query.page)
        return websites
    }

    @Get('any/:key')
    async getAnyByKey (@Param('key') key: string) {
        const websites = await this.websiteService.getWebsiteByKey(key)
        return websites;
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteWebsite(@Param('id', ValidateId) websiteId: string) {
        await this.websiteService.deleteWebsite(websiteId);
        return { message: "Website delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverWesite(@Param('id', ValidateId) websiteId: string) {
        await this.websiteService.recoverWebsite(websiteId);
        return { message: "Website recover successfully" }
    }


    @Patch(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updateWesite(@Param('id', ValidateId) websiteId: string, @Body() websiteDetails: UpdateWebsiteDto) {
        await this.websiteService.updateWebsite(websiteId, websiteDetails);
        return { message: "Website update successfully" }
    }

}