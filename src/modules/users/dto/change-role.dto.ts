import { IsMongoId, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../schema/user.schema';

export class ChangeRoleDto {
  @IsMongoId({ message: "Invalid User Id" })
  @IsNotEmpty()
  _id: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  newRole: UserRoleEnum;
}