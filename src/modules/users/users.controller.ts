import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from './schema/user.schema';
import { RolesGuard } from '../auth/role.guard';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Request, Response } from 'express';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserBookmarksQueryDto } from './dto/get-user-bookmarks.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get('profile')
  @UseGuards(AuthGuard)
  async getCurrentUserProfile(@Req() req: Request){
    const user = await this.usersService.findById((req as any).user._id);
    return user;
  }

  @Get('bookmarks')
  @UseGuards(AuthGuard)
  async getUserBookmarks(@Req() req: Request, @Query() query: GetUserBookmarksQueryDto) {
    const bookmarks = await this.usersService.getUserBookmarks((req as any).user._id, query);
    return bookmarks;
  }
  
  @Patch('profile')
  @UseGuards(AuthGuard)
  async upadteProfile(@Req() req: Request, @Body() updatedUserProfile: UpdateUserDto) {
    await this.usersService.updateProfile((req as any).user._id, updatedUserProfile);
    return { message: "Profile updated successfully" };
  }

  @Get('all-moderator')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllModerators() {
    const users = await this.usersService.getAllModerator()
    return { 
      message: "All moderators fetched successfully", 
      users
    };
  }

  @Get('all-contributor')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllContributor() {
    const users = await this.usersService.getAllContributor()
    return { 
      message: "All contributor fetched successfully",
      users
    };
  }

  @Get('all-subscribers')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllSubscribers() {
    const users = await this.usersService.getAllSubscribers()
    return { 
      message: "All subscribers fetched successfully",
      users
    };
  }
  
  @Get(':id')
  async findById(@Param('id', ValidateId) id: string) {
    return this.usersService.findById(id);
  }

  @Put('change-role')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async changeRole(@Body() changeRoleDto: ChangeRoleDto) {
    const { _id, newRole } = changeRoleDto;
    await this.usersService.changeRole(_id, newRole);
    return { message: "User role changed successfully" }; 
  }

}
