import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { UserRoleEnum, UserStoreRoleEnum } from '../users/schema/user.schema';

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


@Injectable()
export class StoreRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedStoreRoles = this.reflector.get<UserStoreRoleEnum[]>('allowedStoreRoles', context.getHandler());

    // Make sure to provide allowed roles in @AllowedStoreRoles decorator
    // ohterwise StoreRolesGuard will allow all requests to process
    if (!allowedStoreRoles) {
      return true;
    }

    // Make sure to call AuthGuard before RolesGuard
    const req = context.switchToHttp().getRequest();
    req.user.storeRole = await this.userService.getStoreRole(req.user._id);
    return allowedStoreRoles.includes(req.user.storeRole);
  }
}