import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";


export class generateResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class resetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    otp: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: "Password should be atleast 8 characters long" })
    @IsStrongPassword({
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: "Password must contain atleast one lowercase letter, one uppercase letter, one digit and one special character" })
    password: string
}