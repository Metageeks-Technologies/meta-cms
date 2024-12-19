import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    folderName: string;
    
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;

    // Key will be combination of foldername and uuid
    // Example: "users/4369960b-599a-468d-ac5a-28de76343e99"
    // So we can't check if this is uuid or not
    // So, to make sure every media has unique key, We can only make sure that a key will only be present once in the DB
    @IsString()
    @IsNotEmpty()
    key: string;
}
