import { IsOptional, IsMongoId } from 'class-validator';

export class GetSubscribersQueryDto {
  @IsOptional()
  @IsMongoId()
  lastId?: string;
}