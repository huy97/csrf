import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

import { CsrfInvalidException } from "../exceptions/csrf-invalid.exception";
import { getCsrfFromRequest, getSecretFromRequest, verify } from "./../common";
import { CsrfNotFoundException } from "./../exceptions/csrf-not-found.exception";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly message?: string) {
    this.message = message || "Invalid CSRF Token";
  }

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
      throw new CsrfNotFoundException(this.message);
    }
    if (!verify(secret, token)) {
      throw new CsrfInvalidException(this.message);
    }
    return true;
  }
}

@Injectable()
export class CsrfGraphQLGuard implements CanActivate {
  constructor(private readonly message?: string) {
    this.message = message || "Invalid CSRF Token";
  }

  canActivate(ctx: ExecutionContext) {
    const context = GqlExecutionContext.create(ctx);
    const { req: request } = context.getContext();
    const secret = getSecretFromRequest(
      request,
      "session",
      request.cookieConfig
    );
    const token = getCsrfFromRequest(request);
    if (!secret || !token) {
      throw new CsrfNotFoundException(this.message);
    }
    if (!verify(secret, token)) {
      throw new CsrfInvalidException(this.message);
    }
    return true;
  }
}
