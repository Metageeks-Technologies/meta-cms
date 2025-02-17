import { IsString, IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
