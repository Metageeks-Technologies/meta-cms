import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { generateResetPasswordDto, resetPasswordDto } from './dto/resetPassword.dto';
import { emailVerificationDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDetails: LoginDto, @Res() res: Response) {
    const accessToken = await this.authService.login(loginDetails, false);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.status(200).json({ message: 'Login successful' });
  }

  @Post('signup')
  async signup(@Body() newUserDetails: CreateUserDto) {
    await this.authService.signup(newUserDetails);
    return { message: "Sign up successfull" };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: "User logged out successfully" };
  }

  @Post('admin/login')
  async adminLogin(@Body() loginDetails: LoginDto, @Res() res: Response) {
    const accessToken = await this.authService.login(loginDetails, true);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.status(200).json({ message: 'Login successful' });
  }

  @Post('send-reset-password-otp')
  async generateResetPasswordToken(@Body() userDetails: generateResetPasswordDto) {
    await this.authService.resetPasswordOtp(userDetails);
    return { message: "Otp send on your email" }
  }

  @Post('reset-password')
  async resestPassword(@Body() userDetails: resetPasswordDto){
    await this.authService.resetUserPassword(userDetails)
    return { message: "Password reset succesfully" }
  }

  @Post('verifyEmail')
  async verifyEmailId(@Body() userDetails: emailVerificationDto){ 
    await this.authService.verifyEmailId(userDetails)
    return { message: "User verified - Now Login" }
  }

}