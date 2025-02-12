import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubserviceDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly serviceId: string;  // Ensure serviceId is required and validated
}
