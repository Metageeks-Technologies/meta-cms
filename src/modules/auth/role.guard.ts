import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { UserRoleEnum } from '../users/schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<UserRoleEnum[]>('allowedRoles', context.getHandler());

    // Make sure to provide allowed roles in @AllowedRoles decorator
    // ohterwise RolesGuard will allow all requests to process
    if (!allowedRoles) {
      return true;
    }

    // Make sure to call AuthGuard before RolesGuard
    const req = context.switchToHttp().getRequest();
    req.user.role = await this.userService.getRole(req.user._id);
    return allowedRoles.includes(req.user.role);
  }
}
