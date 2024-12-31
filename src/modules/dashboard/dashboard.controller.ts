import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { UserRoleEnum } from '../users/schema/user.schema';

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
  @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getGlobalAdminDashboard() {
    const dashboardData = await this.dashboardService.getGlobalData();
    return dashboardData;
  }
}
