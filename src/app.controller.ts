import { Controller, Get, Req, UseGuards } from '@nestjs/common';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello from server";
  }
}
