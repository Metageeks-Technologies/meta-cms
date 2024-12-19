import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { GetSubscribersQueryDto } from './dto/get-subscribers.dto';
import { UserRoleEnum } from '../users/schema/user.schema';
import { AllowedRoles } from 'src/decorators/allowed-roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async addSubscriber(@Body() newSubscriber: CreateSubscriberDto) {
    await this.subscribersService.addSubscriber(newSubscriber);
    return { message: "Subscribed successfully" };
  }

  @Get()
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getSubscribers(@Query() query: GetSubscribersQueryDto) {
    const subscribers = await this.subscribersService.getSubscribers(query);
    return subscribers;
  }

  @Get('all')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllSubscribers() {
    const subscribers = await this.subscribersService.getAllSubscribers();
    return subscribers;
  }
}
