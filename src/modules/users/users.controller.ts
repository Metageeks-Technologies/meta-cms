import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, Res, Query, Header, Headers } from '@nestjs/common';
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
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('create')
  @AllowedRoles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createNewUser(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() newUserDetails: CreateUserDto) {
    const user = (req as any).user;
    await this.usersService.create(websiteKey, user, newUserDetails);
    return { message: "User create successfully" };
  }

  @Post('create/admin')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createNewAdmin(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() newUserDetails: CreateUserDto) {
    const user = (req as any).user;
    newUserDetails.role = UserRoleEnum.ADMIN;
    await this.usersService.create(websiteKey, user, newUserDetails);
    return { message: "Admin create successfully" };
  }


  @Get('profile')
  @UseGuards(AuthGuard)
  async getCurrentUserProfile(@Req() req: Request) {
    const user = await this.usersService.findById((req as any).user._id);
    return user;
  }

  @Get('bookmarks')
  @UseGuards(AuthGuard)
  async getUserBookmarks(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Query() query: GetUserBookmarksQueryDto) {
    const bookmarks = await this.usersService.getUserBookmarks(websiteKey, (req as any).user._id, query);
    return bookmarks;
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async upadteProfile(@Req() req: Request, @Body() updatedUserProfile: UpdateUserDto) {
    await this.usersService.updateProfile((req as any).user._id, updatedUserProfile);
    return { message: "Profile updated successfully" };
  }

  @Get('all-admin')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllAdmin(@Query() query: UserQueryDto) {
    const admins = await this.usersService.getAllAdmin(query.page)
    return admins;
  }

  @Get('all-user/:role')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUser(
    @Headers('websiteKey') websiteKey: string, 
    @Param('role') role: UserRoleEnum,
    @Query() query: UserQueryDto
  ) {
    const users = await this.usersService.getAllUser(websiteKey, role, query.page)
    return users
  }


  //
  @Get('all-moderator')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllModerators(@Headers('websiteKey') websiteKey: string,) {
    const users = await this.usersService.getAllModerator()
    return {
      message: "All moderators fetched successfully",
      users
    };
  }


  //
  @Get('all-contributor')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllContributor(@Headers('websiteKey') websiteKey: string,) {
    const users = await this.usersService.getAllContributor()
    return {
      message: "All contributor fetched successfully",
      users
    };
  }


  //
  @Get('all-subscriber')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllSubscribers(@Headers('websiteKey') websiteKey: string,) {
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

  @Get('all-store-vendor')
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
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async changeRole(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() changeRoleDto: ChangeRoleDto) {
    const { _id, newRole } = changeRoleDto;
    const user = (req as any).user;
    await this.usersService.changeRole(websiteKey, user.role, _id, newRole);
    return { message: "User role changed successfully" };
  }

  @Put('change-store-role')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async changeStoreRole(@Body() changeRoleDto: ChangeStoreRole) {
    const { _id, newRole } = changeRoleDto;
    await this.usersService.changeStoreRole(_id, newRole);
    return { message: "User role changed successfully" };
  }

  @Patch('block/:id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async blockUser(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) userId: string) {
    await this.usersService.blockUser(websiteKey, userId)
    return { message: "User block succesfully" }
  }

  @Patch('unBlock/:id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async unBlockUser(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) userId: string) {
    await this.usersService.unBlockUser(websiteKey, userId)
    return { message: "User unblock succesfully" }
  }

}
