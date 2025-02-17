import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "../users/schema/user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/role.guard";
import { CreatePermissionDto } from "./dto/create-permission-dto";
import { UpdatePermissionDto } from "./dto/update-permission-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";




@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }


    @Post()
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createNewPermission(@Body() permissionDetails: CreatePermissionDto) {
        await this.permissionService.createPermission(permissionDetails);
        return { message: "Permission create successfully" }
    }

    @Get()
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getPermission() {
        const permissions = await this.permissionService.getPermission()
        return permissions;
    }


    @Patch(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updatePermission(@Param('id', ValidateId) id: string, @Body() permissionDetails: UpdatePermissionDto) {
        await this.permissionService.updatePermission(id, permissionDetails);
        return { message: "Permission updated successfully" }
    }

    @Delete(':id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deletePermission(@Param('id', ValidateId) id: string) {
        await this.permissionService.deletePermission(id);
        return { message: "Permission delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverPermission(@Param('id', ValidateId) id: string) {
        await this.permissionService.recoverPermission(id)
        return { message: "Permission recover successfully" }
    }
}