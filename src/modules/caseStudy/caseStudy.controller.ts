import { All, Body, Controller, Delete, Get, Header, Headers, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CaseStudyService } from "./caseStudy.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { CreateCaseStudyDto } from "./dto/create-caseStudy-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateCaseStudyDto } from "./dto/update-caseStudy.dto";
import { CaseStudyQueryDto } from "./dto/get-caseStudy.dto";



@Controller('caseStudy')
export class CaseStudyController {
    constructor(
        private readonly caseStudyService: CaseStudyService
    ) { }

    @Post()
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async creareCaseStudy(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Body() newCaseStudy: CreateCaseStudyDto
    ) {
        const user = (req as any).user;
        await this.caseStudyService.create(websiteKey, user._id, newCaseStudy);
        return { message: "Casestudy created successfully" }
    }


    @Get('public')
    async getPublicCaseStudy(@Headers('websiteKey') websiteKey: string) {
        const caseStudies = await this.caseStudyService.getPublic(websiteKey)
        return caseStudies;
    }


    @Get('public/:slug')
    async getPublicCaseStudyBySlug(
        @Headers('websiteKey') websiteKey: string,
        @Param('slug') slug: string
    ) {
        const caseStudy = await this.caseStudyService.getBySlug(websiteKey, slug, true, false)
        return caseStudy;
    }

    @Get()
    async getCaseStudy(
        @Headers('websiteKey') websiteKey: string,
    ) {
        const caseStudies = await this.caseStudyService.getAll(websiteKey, undefined, undefined, false)
        return caseStudies;
    }

    @Get('all')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllCaseStudy(
        @Headers('websiteKey') websiteKey: string,
        @Query() query: CaseStudyQueryDto
    ) {
        const caseStudies = await this.caseStudyService.getAll(websiteKey, query.page, query.search);
        return caseStudies;
    }

    @Get(':slug')
    async getCaseStudyBySlug(
        @Headers('websiteKey') websiteKey: string,
        @Param('slug') slug: string
    ) {
        const caseStudy = await this.caseStudyService.getBySlug(websiteKey, slug, false)
        return caseStudy;
    }


    @Put(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updateCaseStudy(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) id: string,
        @Body() updatedDeatils: UpdateCaseStudyDto
    ) {
        await this.caseStudyService.update(websiteKey, id, updatedDeatils)
        return { message: "Update successfully" }
    }


    @Delete(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteCaseStudy(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) id: string,
    ) {
        await this.caseStudyService.delete(websiteKey, id)
        return { message: "Delete successfully" }
    }

    @Patch(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverCaseStudy(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) id: string,
    ) {
        await this.caseStudyService.recover(websiteKey, id)
        return { message: "Recover successfully" }
    }
}