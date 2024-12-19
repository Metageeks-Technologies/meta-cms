import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Log Internal Server errors
    if (status === 500) {
      this.loggerService.error(
        'Internal Server Error',
        {
          request: {
            method: request.method,
            url: request.url,
            body: request.body,
            headers: request.headers,
          },
          exception: {
            message: exception.message,
            stack: exception.stack,
            response: exception.getResponse(),
          },
        }
      );
    }

    //Forward the exception as-is to the client
    const errorResponse = exception.getResponse();
    response.status(status).json({
      ...(
        typeof errorResponse === 'string' 
          ? { message: errorResponse }
          : errorResponse
      ),
      statusCode: status
    });
  }
}
