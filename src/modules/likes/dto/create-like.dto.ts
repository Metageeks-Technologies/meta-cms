import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateLikeDto {
    @IsMongoId({ message: "Invalid User Id" })
    @IsNotEmpty()
    userId: string;

    @IsMongoId({ message: "Invalid User Id" })
    @IsNotEmpty()
    postId: string;
}