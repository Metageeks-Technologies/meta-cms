import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';

    // Console logging format
    const consoleLogFormat = winston.format.printf(
      ({ level, message, timestamp }) => {
        return '------------------------------------------------------------------------\n' +
          `[${level}] [${timestamp}]\n` +
          `${message}\n` +
          '------------------------------------------------------------------------';
      }
    );

    // Winston Logger configuration
    this.logger = winston.createLogger({
      // Default level for file logs
      level: 'debug',

      // Default format for file logs
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),

      transports: [
        new winston.transports.DailyRotateFile({
          dirname: './logs/',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD_HH:mm',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),

        // Console File format. Has own levels and formats
        new winston.transports.Console({
          level: this.isDev ? 'debug' : 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            consoleLogFormat,
          ),
        })
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, cookies } = req;
    const logEntry = {
      method,
      url: originalUrl,
      query,
      body,
      cookies,
    };
    this.logger.debug(`Incoming Request: ${JSON.stringify(logEntry, undefined, 2)}`, logEntry);
    next();
  }
}
