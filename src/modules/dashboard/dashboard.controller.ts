import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';
import { UserRoleEnum, UserStoreRoleEnum } from '../users/schema/user.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  @Get('admin/personal')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getPersonalAdminDashboard(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const dashboardData = await this.dashboardService.getPersonalData(websiteKey, userId, userRole);
    return dashboardData;
  }

  @Get('admin/global')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getGlobalAdminDashboard(@Headers('websiteKey') websiteKey: string) {
    const dashboardData = await this.dashboardService.getGlobalData(websiteKey);
    return dashboardData;
  }

  @Get('store/admin')
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getStoreAdminDashboard(@Headers('websiteKey') websiteKey: string) {
    const dashboardData = await this.dashboardService.getStoreAdminData(websiteKey);
    return dashboardData;
  }


  @Get('store/vendor')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getStoreVendorDashboard(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
    const user = (req as any).user;
    const dashboardData = await this.dashboardService.getStoreVendorData(websiteKey, user._id);
    return dashboardData;
  }
}
