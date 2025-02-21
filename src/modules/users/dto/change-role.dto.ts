import { IsMongoId, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../schema/user.schema';


// TODO: Remove this part when refactoring
export class ChangeRoleDto {
  @IsMongoId({ message: "Invalid User Id" })
  @IsNotEmpty()
  _id: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  newRole: UserRoleEnum;
}

export class ChangeStoreRole {
  @IsMongoId({ message: "Invalid User Id" })
  @IsNotEmpty()
  _id: string;

  // @IsEnum(UserStoreRoleEnum)
  // @IsNotEmpty()
  // newRole: UserStoreRoleEnum;
}