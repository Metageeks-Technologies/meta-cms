import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateSubserviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  service: string;
}
