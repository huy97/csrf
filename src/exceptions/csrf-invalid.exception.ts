import { HttpException, HttpStatus } from "@nestjs/common";

export class CsrfInvalidException extends HttpException {
  constructor(message?: string, code?: HttpStatus) {
    super(message || "Invalid CSRF Token", code || HttpStatus.FORBIDDEN);
  }
}
