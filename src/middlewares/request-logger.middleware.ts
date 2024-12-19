import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/common/logger/logger.service';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, cookies } = req;
    const reqLogEntry = {
      method,
      url: originalUrl,
      query,
      body,
      cookies,
    };
    this.loggerService.debug("Incoming Request", { request : reqLogEntry });
    next();
  }
}
