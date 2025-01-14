import { ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRoleEnum } from '../users/schema/user.schema';
import { generateResetPasswordDto, resetPasswordDto } from './dto/resetPassword.dto';
import { sendEmail } from 'src/utils/emailService';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { emailVerificationDto } from './dto/signup.dto';


const revokedTokens = new Set<string>();
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(loginDetails: LoginDto, isAdminLogin: boolean) {
    const { email, password } = loginDetails;
    const user = await this.usersService.findByEmail(email);

    if (!user.verify) {
      const payload = {
        email: email
      }
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY_EMAIL_VERIFY,
        expiresIn: '10m'
      });
      const link = `http://localhost:3000/verifyEmail/${token}`

      console.log(link);

      const emailBody = `
      <h1>Hello</h1>
      <p>Please verify your email: ${email}</p>
      <p>Email vrification link :- ${link}</p>
    `;

      await sendEmail(
        email,
        "Email verification - MetaCMS",
        emailBody
      )

      throw new ForbiddenException("First verify account - Email sent")
    }

    if (user.block) {
      throw new ForbiddenException('Account blocked contact to Admin');
    }

    if (isAdminLogin && user.role === UserRoleEnum.SUBSCRIBER) {
      throw new ForbiddenException("You cannot login on this route");
    }

    const passwordMatch = await bcrypt.compare(password, user.hash);
    if (!passwordMatch) {
      throw new HttpException("Wrong Password", 401)
    }

    const accessToken = await this.jwtService.signAsync({ _id: user._id });
    return accessToken;
  }

  async adminLogin(loginDetails: LoginDto) {

  }

  async signup(newUserDetails: CreateUserDto) {
    await this.usersService.create(newUserDetails);
  }

  async resetPasswordOtp(userDetails: generateResetPasswordDto) {
    const { email } = userDetails;
    await this.usersService.sendResetPasswordOtp(email)
  }

  async resetUserPassword(userDetails: resetPasswordDto) {
    const { email, otp, password } = userDetails;
    await this.usersService.changePassword(email, otp, password)
  }

  async verifyEmailId(userDetails: emailVerificationDto) {
    const { email } = userDetails;
    await this.usersService.emailVerificationOtp(email);
  }

}
