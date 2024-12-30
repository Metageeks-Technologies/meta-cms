import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRoleEnum } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async login(loginDetails: LoginDto, isAdminLogin: boolean) {
    const { email, password } = loginDetails;
    const user = await this.usersService.findByEmail(email);

    if(isAdminLogin && user.role === UserRoleEnum.SUBSCRIBER) {
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

}
