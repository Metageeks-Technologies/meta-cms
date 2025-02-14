import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards, Patch } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { CreateSubserviceDto } from './dto/create-subservice-dto';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum, UserStoreRoleEnum } from 'src/modules/users/schema/user.schema';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { UpdateSubserviceDto } from './dto/update-subservice-dto';

@Controller('subservices')
export class SubserviceController {
  constructor(private readonly subserviceService: SubserviceService) { }

  @Post()
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Headers("websiteKey") websiteKey: string, @Body() newSubservice: CreateSubserviceDto) {
    await this.subserviceService.create(websiteKey, newSubservice);
    return { message: "Subservice created successfully" }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Headers("websiteKey") websiteKey: string,) {
    const subServices = await this.subserviceService.findAll(websiteKey, false);
    return subServices;
  }

  @Get('all')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getallSubservice(@Headers("websiteKey") websiteKey: string) {
    const subServices = await this.subserviceService.findAll(websiteKey)
    return subServices;
  }


  @Delete(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async softDelete(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.subserviceService.deleteSubservice(websiteKey, id);
    return { message: 'Delete successfully' }
  }

  @Patch(':id/recover')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recover(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.subserviceService.recoverSubservice(websiteKey, id);
    return { message: "Delete successfully" }
  }

  @Put(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateSubservice(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string, @Body() subServiceDeatil: UpdateSubserviceDto) {
    await this.subserviceService.updateSubservice(websiteKey, id, subServiceDeatil);
    return { message: "Update successfully" }
  }
}
