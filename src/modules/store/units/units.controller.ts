import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { UnitService } from "./units.service";
import { RolesGuard, StoreRolesGuard } from "src/modules/auth/role.guard";
import { UserRoleEnum, UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { AllowedRoles, AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { CreateUnitDto } from "./dto/create-unit-dto";
import { UpdateUnitDto } from "./dto/update-unit-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";



@Controller('unit')
export class UnitController {
    constructor(private readonly unitService: UnitService) { }

    @Post()
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createUnit(
        @Headers('websiteKey') websiteKey: string,
        @Body() unitDetails: CreateUnitDto
    ) {
        await this.unitService.create(websiteKey, unitDetails);
        return { message: "Unit create successfully" }
    }


    @Patch(':id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updateUnit(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) unitId: string,
        @Body() unitsDetails: UpdateUnitDto
    ) {
        await this.unitService.updateById(websiteKey, unitId, unitsDetails)
        return { message: "Unit updated successfully" }
    }

    @Get()
    @UseGuards(AuthGuard)
    async getUnits(@Headers('websiteKey') websiteKey: string) {
        const units = await this.unitService.getAll(websiteKey, false);
        return units;
    }

    @Get('all')
    @UseGuards(AuthGuard)
    async getAllUnits(@Headers('websiteKey') websiteKey: string) {
        const units = await this.unitService.getAll(websiteKey);
        return units;
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUnit(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) unitId: string
    ) {
        await this.unitService.deleteUnit(websiteKey, unitId);
        return { message: "Unit delete succesfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverUnit(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) unitId: string
    ) {
        await this.unitService.recoverUnit(websiteKey, unitId);
        return { message: "Unit recover successfully" }
    }

}