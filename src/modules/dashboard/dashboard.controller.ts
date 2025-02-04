import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';
import { UserRoleEnum, UserStoreRoleEnum } from '../users/schema/user.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Get('admin/personal')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getPersonalAdminDashboard(@Req() req: Request) {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const dashboardData = await this.dashboardService.getPersonalData(userId, userRole);
    return dashboardData;
  }

  @Get('admin/global')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getGlobalAdminDashboard() {
    const dashboardData = await this.dashboardService.getGlobalData();
    return dashboardData;
  }

  @Get('store/admin')
  @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async getStoreAdminDashboard() {
    const dashboardData = await this.dashboardService.getStoreAdminData();
    return dashboardData;
  }


  @Get('store/vendor')
  @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async getStoreVendorDashboard(@Req() req: Request) {
    const user = (req as any).user;
    const dashboardData = await this.dashboardService.getStoreVendorData(user._id);
    return dashboardData;
  }
}
