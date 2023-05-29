import { HttpException, HttpStatus } from "@nestjs/common";

export class CsrfNotFoundException extends HttpException {
  constructor(message?: string, code?: HttpStatus) {
    super(message || "CSRF token not found", code || HttpStatus.FORBIDDEN);
  }
}
