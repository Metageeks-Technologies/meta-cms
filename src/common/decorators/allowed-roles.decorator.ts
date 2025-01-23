import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum, UserStoreRoleEnum } from 'src/modules/users/schema/user.schema';

export const AllowedRoles = (...roles: UserRoleEnum[]) => SetMetadata('allowedRoles', roles);

export const AllowedStoreRoles = (...roles: UserStoreRoleEnum[]) => SetMetadata('allowedStoreRoles', roles);