import { IsMongoId, IsOptional } from "class-validator";


export class commentQueryDto {
    @IsOptional()
    @IsMongoId()
    lastId?: string;
}