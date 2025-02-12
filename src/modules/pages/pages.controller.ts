import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PagesService } from "./pages.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { CreatePageDto } from "./dto/create-page.dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdatePageDto } from "./dto/update-page.dto";
import { PageServiceEnum, PageSubServiceEnum } from "./schema/page.schema";
import { GetPageQueryDto } from "./dto/get-page-dto";


@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createPage(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() newPageDetails: CreatePageDto) {
        const authorId = (req as any).user._id;
        await this.pagesService.createPage(websiteKey, newPageDetails, authorId);
        return { message: "Page created successfully" }
    }

    @Get('public/:slug')
    async getPublicPageBySlug(@Param('slug') slug: string, @Query() query: GetPageQueryDto) {
        const page = await this.pagesService.getPageBySlug(query.website, slug, false);
        return page;
    }

    @Get('private/:slug')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getPageBySlug(@Headers('websiteKey') websiteKey: string, @Param('slug') slug: string) {
        const page = await this.pagesService.getPageBySlug(websiteKey, slug);
        return page;
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deletePageById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
        await this.pagesService.deletePageById(websiteKey, id)
        return { message: "Page deleted Succesfully" }
    }

    @Patch(':id/recover')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverPageById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
        await this.pagesService.recoverPage(websiteKey, id)
        return { message: "Page recover succesfully" }
    }

    @Patch(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updatePage(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string, @Body() updateContent: UpdatePageDto) {
        await this.pagesService.updatePage(websiteKey, id, updateContent);
        return { message: "Page updated succesfully" }
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllPage(@Headers('websiteKey') websiteKey: string): Promise<any> {
        const allPage = await this.pagesService.getAllPage(websiteKey);
        return allPage
    }

    @Get('titles/:service')
    async getAllPageTitle(@Param('service') service: PageServiceEnum, @Query() query: GetPageQueryDto) {
        const pages = await this.pagesService.getPageTitles(query.website, service)
        return pages;
    }
}