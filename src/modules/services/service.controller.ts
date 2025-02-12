import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum, UserStoreRoleEnum } from 'src/modules/users/schema/user.schema';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  create(@Headers("websiteKey") websiteKey: string, @Body() createServiceDto: CreateServiceDto) {
  
    return this.serviceService.create(createServiceDto,websiteKey);
  }

  @Delete(':id/soft-delete')
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  async softDelete(@Headers("websiteKey") websiteKey: string, @Param('id') id: string) {
    return this.serviceService.softDelete(id);
  }

  // Recover (restore) a service
  @Put(':id/recover')
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  async recover(@Headers("websiteKey") websiteKey: string, @Param('id') id: string) {
    return this.serviceService.recover(id);
  }

  @Get()
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  findAll(@Headers("websiteKey") websiteKey: string) {
    return this.serviceService.findAll();
  }
}
