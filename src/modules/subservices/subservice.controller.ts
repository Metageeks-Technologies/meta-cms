import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards, Patch, Query } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { CreateSubserviceDto } from './dto/create-subservice-dto';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from 'src/modules/users/schema/user.schema';
import { RolesGuard } from '../auth/role.guard';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { UpdateSubserviceDto } from './dto/update-subservice-dto';
import { SubServiceQueryDto } from './dto/get-subservice.dto';

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

  @Get('total/:id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getallSubservice(
    @Headers("websiteKey") websiteKey: string, 
    @Param('id', ValidateId) serviceId: string,
    @Query() query: SubServiceQueryDto
  ) {
    const subServices = await this.subserviceService.findByServiceId(websiteKey, serviceId, query.page)
    return subServices;
  }

  @Get('all/:id')
  @UseGuards(AuthGuard)
  async getallSubserviceByServiceId(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) serviceId: string) {
    const subServices = await this.subserviceService.findByServiceId(websiteKey, serviceId, undefined, false);
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
    return { message: "Recover successfully" }
  }ƒ

  @Put(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateSubservice(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string, @Body() subServiceDeatil: UpdateSubserviceDto) {
    await this.subserviceService.updateSubservice(websiteKey, id, subServiceDeatil);
    return { message: "Update successfully" }
  }
}
