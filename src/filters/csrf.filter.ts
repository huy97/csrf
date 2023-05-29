import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { CsrfInvalidException } from "../exceptions/csrf-invalid.exception";
import { CsrfNotFoundException } from "../exceptions/csrf-not-found.exception";

@Catch(CsrfInvalidException, CsrfNotFoundException)
export class CsrfFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
