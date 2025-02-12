import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PremissionService } from "./premission.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { CreatePremissionDto } from "./dto/create-premission-dto";
import { UpdatePremissionDto } from "./dto/update-premission-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";




@Controller('premission')
export class PremissionController {
    constructor(private readonly premissionService: PremissionService) { }


    @Post()
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createNewPremission(@Body() premissionDetails: CreatePremissionDto) {
        await this.premissionService.createPremission(premissionDetails);
        return { message: "Premission create successfully" }
    }

    @Get()
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getPremission() {
        const premissions = await this.premissionService.getPremission()
        return premissions;
    }


    @Patch(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updatePremission(@Param('id', ValidateId) id: string, @Body() premissionDetails: UpdatePremissionDto) {
        await this.premissionService.updatePremission(id, premissionDetails);
        return { message: "Premission updated successfully" }
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deletePremission(@Param('id', ValidateId) id: string) {
        await this.premissionService.deletePremission(id);
        return { message: "Premission delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverPremission(@Param('id', ValidateId) id: string) {
        await this.premissionService.recoverPremission(id)
        return { message: "Premission recover successfully" }
    }
}