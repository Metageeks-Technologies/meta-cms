import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum, UserStoreRoleEnum } from './schema/user.schema';
import { RolesGuard, StoreRolesGuard } from '../auth/role.guard';
import { ChangeRoleDto, ChangeStoreRole } from './dto/change-role.dto';
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

  @Get('all-subscriber')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllSubscribers() {
    const users = await this.usersService.getAllSubscribers()
    return { 
      message: "All subscribers fetched successfully",
      users
    };
  }

  @Get('all-store-user')
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async getAllStoreUser() {
    const users = await this.usersService.getAllStoreUsers(UserStoreRoleEnum.USER)
    return { 
      message: "All Users fetched successfully",
      users
    };
  }

  @Get('all-store-vendors')
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async getAllStoreVendor() {
    const vendors = await this.usersService.getAllStoreUsers(UserStoreRoleEnum.VENDOR)
    return { 
      message: "All Vendors fetched successfully",
      vendors
    };
  }

  @Get('all-store-moderator')
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async getAllStoreModerator() {
    const users = await this.usersService.getAllStoreUsers(UserStoreRoleEnum.MODERATOR)
    return { 
      message: "All Moderator fetched successfully",
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

  @Put('change-store-role')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async changeStoreRole(@Body() changeRoleDto: ChangeStoreRole) {
    const { _id, newRole } = changeRoleDto;
    await this.usersService.changeStoreRole(_id, newRole);
    return { message: "User role changed successfully" }; 
  }

  @Patch('block/:id')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async blockUser(@Param('id', ValidateId) userId: string){
    await this.usersService.blockUser(userId)
    return { message: "User block succesfully" }
  }

  @Patch('unBlock/:id')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async unBlockUser(@Param('id', ValidateId) userId: string){
    await this.usersService.unBlockUser(userId)
    return { message: "User unblock succesfully" }
  }

}
