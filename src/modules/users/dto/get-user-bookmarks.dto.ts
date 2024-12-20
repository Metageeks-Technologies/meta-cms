import { IsOptional, IsMongoId } from 'class-validator';

export class GetUserBookmarksQueryDto {
  @IsOptional()
  @IsMongoId()
  lastId?: string;
}
