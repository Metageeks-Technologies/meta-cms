import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { UnitService } from "./units.service";
import { StoreRolesGuard } from "src/modules/auth/role.guard";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { CreateUnitDto } from "./dto/create-unit-dto";
import { UpdateUnitDto } from "./dto/update-unit-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";



@Controller('unit')
export class UnitController {
    constructor(private readonly unitService: UnitService) { }

    @Post()
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async createUnit(@Body() unitDetails: CreateUnitDto) {
        await this.unitService.create(unitDetails);
        return { message: "Unit create successfully" }
    }


    @Patch(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateUnit(@Param('id', ValidateId) unitId: string, @Body() unitsDetails: UpdateUnitDto) {
        await this.unitService.updateById(unitId, unitsDetails)
        return { message: "Unit updated successfully" }
    }

    @Get()
    @UseGuards(AuthGuard)
    async getUnits() {
        const units = await this.unitService.getAll(false);
        return units;
    }

    @Get('all')
    @UseGuards(AuthGuard)
    async getAllUnits() {
        const units = await this.unitService.getAll();
        return units;
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUnit(@Param('id', ValidateId) unitId: string) {
        await this.unitService.deleteUnit(unitId);
        return { message: "Unit delete succesfully" }
    }

    @Patch('recover/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async recoverUnit(@Param('id', ValidateId) unitId: string) {
        await this.unitService.recoverUnit(unitId);
        return { message: "Unit recover successfully" }
    }


}