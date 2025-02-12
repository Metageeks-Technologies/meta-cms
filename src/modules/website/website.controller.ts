import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { AllowedRoles, AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum, UserStoreRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard, StoreRolesGuard } from "../auth/role.guard";
import { AddWebSiteDto } from "./dto/create-website-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateWebsiteDto } from "./dto/update-website-dto";


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
    async getWebsites() {
        const websites = await this.websiteService.getWebsites(false)
        return websites;
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard, StoreRolesGuard)
    async getAllWebsites() {
        const websites = await this.websiteService.getWebsites(undefined)
        return websites
    }

    @Get('any/:key')
    async getAnyByKey (@Param('key') key: string) {
        const websites = await this.websiteService.getWebsiteByKey(key)
        return websites;
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard, StoreRolesGuard)
    async deleteWebsite(@Param('id', ValidateId) websiteId: string) {
        await this.websiteService.deleteWebsite(websiteId);
        return { message: "Website delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard, StoreRolesGuard)
    async recoverWesite(@Param('id', ValidateId) websiteId: string) {
        await this.websiteService.recoverWebsite(websiteId);
        return { message: "Website recover successfully" }
    }


    @Patch(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard, StoreRolesGuard)
    async updateWesite(@Param('id', ValidateId) websiteId: string, @Body() websiteDetails: UpdateWebsiteDto) {
        await this.websiteService.updateWebsite(websiteId, websiteDetails);
        return { message: "Website update successfully" }
    }

}