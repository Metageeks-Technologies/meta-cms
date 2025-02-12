import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { CreateSubserviceDto } from './dto/create-subservice.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum, UserStoreRoleEnum } from 'src/modules/users/schema/user.schema';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';

@Controller('subservices')
export class SubserviceController {
  constructor(private readonly subserviceService: SubserviceService) {}

  @Post()
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  create(@Headers("websiteKey") websiteKey: string, @Body() createSubserviceDto: CreateSubserviceDto) {
    return this.subserviceService.create(createSubserviceDto, websiteKey);
  }

  @Get()
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  findAll(@Headers("websiteKey") websiteKey: string,) {
    return this.subserviceService.findAll();
  }

  @Get(':serviceId')
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  findByServiceId(@Headers("websiteKey") websiteKey: string, @Param('serviceId') serviceId: string) {
    return this.subserviceService.findByServiceId(serviceId);
  }

  
  @Delete(':id/soft-delete')
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  async softDelete(@Headers("websiteKey") websiteKey: string, @Param('id') id: string) {
    return this.subserviceService.softDelete(id);
  }

  @Put(':id/recover')
  @AllowedRoles( UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard)
  async recover(@Headers("websiteKey") websiteKey: string, @Param('id') id: string) {
    return this.subserviceService.recover(id);
  }
}
