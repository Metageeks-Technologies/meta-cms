import { ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRoleEnum } from '../users/schema/user.schema';
import { generateResetPasswordDto, resetPasswordDto } from './dto/resetPassword.dto';
import { sendEmail } from 'src/utils/emailService';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async login(loginDetails: LoginDto, isAdminLogin: boolean) {
    const { email, password } = loginDetails;
    const user = await this.usersService.findByEmail(email);

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

  async createResetPassToken(userDetails: generateResetPasswordDto) {
    const { email } = userDetails;

    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const token = await this.jwtService.signAsync({ email }, {
      secret: process.env.JWT_SECRET_KEY_RESET_PASS,
      expiresIn: '10m',
    });

    await sendEmail(
      email,
      "Resest password email - Meta-CMS",
      `Reset password token - ${token}`
    )
  }


  async resetUserPassword(userDetails: resetPasswordDto) {
    const { token, password } = userDetails;
    try {
      const payload = await this.jwtService.decode(token);
      const email = payload.email;
      
      await this.usersService.changePassword(email, password);

    } catch {
      throw new UnauthorizedException();
    }
  }

}
