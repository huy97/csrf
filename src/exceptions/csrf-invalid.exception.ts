import { HttpException, HttpStatus } from "@nestjs/common";

export class CsrfInvalidException extends HttpException {
  constructor() {
    super("Invalid CSRF Token", HttpStatus.FORBIDDEN);
  }
}
