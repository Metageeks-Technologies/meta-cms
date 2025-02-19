import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/modules/users/schema/user.schema';

export const AllowedRoles = (...roles: UserRoleEnum[]) => SetMetadata('allowedRoles', roles);

// TODO: Remove this part when refactoring
// export const AllowedStoreRoles = (...roles: UserStoreRoleEnum[]) => SetMetadata('allowedStoreRoles', roles);