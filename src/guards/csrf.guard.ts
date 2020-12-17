import {
  getSecretFromRequest,
  getCsrfFromRequest,
  verify,
} from "./../common/index";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CsrfInvalidException } from "../exceptions/csrf-invalid.exception";
import { CsrfNotFoundException } from "./../exceptions/csrf-not-found.exception";
import { Observable } from "rxjs";

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const secret = getSecretFromRequest(
      request,
      "session",
      request.cookieConfig
    );
    const token = getCsrfFromRequest(request);
    if (!secret || !token) {
      throw new CsrfNotFoundException();
    }
    if (!verify(secret, token)) {
      throw new CsrfInvalidException();
    }
    return true;
  }
}
