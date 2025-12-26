import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let code = 50000;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      console.log('HttpException', res);

      // res 可能是 string | object
      if (typeof res === 'object' && (res as any).message) {
        const msg = (res as any).message;

        // class-validator 的错误是数组
        if (Array.isArray(msg)) {
          message = msg[0]; // 只返回第一条
        } else {
          message = msg;
        }
      }

      code = status; // 简单示例，后面可定制
    }

    response.status(status).json({
      code,
      message,
      data: null,
    });
  }
}
