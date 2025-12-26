import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, code: number = HttpStatus.BAD_REQUEST) {
    super(
      {
        message,
        code,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
