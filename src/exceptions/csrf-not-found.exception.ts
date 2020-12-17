import { HttpException, HttpStatus } from "@nestjs/common";

export class CsrfNotFoundException extends HttpException {
  constructor() {
    super("CSRF token not found", HttpStatus.FORBIDDEN);
  }
}
