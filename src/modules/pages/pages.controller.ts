import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PagesService } from "./pages.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { CreatePageDto } from "./dto/create-page.dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdatePageDto } from "./dto/update-page.dto";


@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createPage(@Req() req: Request, @Body() newPageDetails: CreatePageDto) {
        const authorId = (req as any).user._id;
        await this.pagesService.createPage(newPageDetails, authorId);
        return { message: "Page created successfully" }
    }

    @Get('public/:slug')
    async getPublicPageBySlug(@Param('slug') slug: string){
        const page = await this.pagesService.getPageBySlug(slug, false);
        return page;
    }

    @Get('private/:slug')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getPageBySlug(@Param('slug') slug: string){
        const page = await this.pagesService.getPageBySlug(slug);
        return page;
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deletePageById(@Param('id', ValidateId) id: string){
        await this.pagesService.deletePageById(id)
        return { message: "Page deleted Succesfully" }
    }

    @Patch(':id/recover')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverPageById(@Param('id', ValidateId) id: string){
        await this.pagesService.recoverPage(id)
        return { message: "Page recover succesfully" }
    }

    @Patch(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updatePage (@Param('id', ValidateId) id: string, @Body() updateContent: UpdatePageDto) {
        await this.pagesService.updatePage(id, updateContent);
        return { message: "Page updated succesfully" }
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllPage (): Promise<any> {
        const allPage = this.pagesService.getAllPage()
        return allPage
    }

}