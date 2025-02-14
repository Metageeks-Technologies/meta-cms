import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards, Patch } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service-dto';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from 'src/modules/users/schema/user.schema';
import { RolesGuard } from '../auth/role.guard';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { UpdateServiceDto } from './dto/update-service-dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Headers("websiteKey") websiteKey: string, @Body() newService: CreateServiceDto) {
    await this.serviceService.create(websiteKey, newService);
    return { message: "Service create succesfully" }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getService(@Headers("websiteKey") websiteKey: string) {
    const services = await this.serviceService.findAll(websiteKey, false);
    return services;
  }

  @Get('all')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllService(@Headers("websiteKey") websiteKey: string) {
    const services = await this.serviceService.findAll(websiteKey);
    return services;
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async softDelete(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.serviceService.deleteService(websiteKey, id);
    return { message: "Service delete successfully" }
  }

  // Recover (restore) a service
  @Patch(':id/recover')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recover(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.serviceService.recoverService(websiteKey, id);
    return { message: "Service recover successfully" }
  }

  @Put(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateService(@Headers("websiteKey") websiteKey: string, @Param('id', ValidateId) id: string, @Body() serviceDetail: UpdateServiceDto) {
    await this.serviceService.updateService(websiteKey, id, serviceDetail);
    return { message: "Service update successfully" }
  }

}
