import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetMediaQueryDto } from './dto/get-media.dto';
import { GetSignedUploadUrlDTO } from './dto/get-signed-upload-url.dto';
import { AllowedRoles } from 'src/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../users/schema/user.schema';
import { RolesGuard } from '../auth/role.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('signed-upload-url')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getSignedUploadUrl(@Body() mediaData: GetSignedUploadUrlDTO) {
    return this.mediaService.getSignedUploadUrl(mediaData);
  }

  @Post()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async addMedia(@Body() mediaData: CreateMediaDto) {
    await this.mediaService.addMedia(mediaData);
    return { message: "Media added successfully" };
  }

  @Get()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getMedia(@Query() query: GetMediaQueryDto) {
    const media = await this.mediaService.getMedia(query);
    return media;
  }

}
