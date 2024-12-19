import { IsOptional, IsMongoId } from 'class-validator';

export class GetMediaQueryDto {
  @IsOptional()
  @IsMongoId()
  lastId?: string;
}