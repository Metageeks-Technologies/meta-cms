import { IsEmail, IsNotEmpty } from "class-validator";


export class emailVerificationDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}