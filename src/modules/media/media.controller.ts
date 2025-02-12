import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Headers } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetMediaQueryDto } from './dto/get-media.dto';
import { GetSignedUploadUrlDTO } from './dto/get-signed-upload-url.dto';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../users/schema/user.schema';
import { RolesGuard } from '../auth/role.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('signed-upload-url')
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getSignedUploadUrl(@Headers('websiteKey') websiteKey: string, @Body() mediaData: GetSignedUploadUrlDTO) {
    return this.mediaService.getSignedUploadUrl(websiteKey, mediaData);
  }

  @Post()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async addMedia(@Headers('websiteKey') websiteKey: string, @Body() mediaData: CreateMediaDto) {
    await this.mediaService.addMedia(websiteKey, mediaData);
    return { message: "Media added successfully" };
  }

  @Get()
  @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getMedia(@Headers('websiteKey') websiteKey: string, @Query() query: GetMediaQueryDto) {
    const media = await this.mediaService.getMedia(websiteKey, query);
    return media;
  }

}
