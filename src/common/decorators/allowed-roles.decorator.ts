import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/modules/users/schema/user.schema';

export const AllowedRoles = (...roles: UserRoleEnum[]) => SetMetadata('allowedRoles', roles);