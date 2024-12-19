import { IsNotEmpty, IsString } from "class-validator";

export class GetSignedUploadUrlDTO {
    @IsString()
    @IsNotEmpty()
    folderName: string;
    
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;
}