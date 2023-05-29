import { applyDecorators, UseGuards } from "@nestjs/common";

import { CsrfGraphQLGuard, CsrfGuard } from "../guards/csrf.guard";

export const Csrf = (message?: string) => {
  return applyDecorators(UseGuards(new CsrfGuard(message)));
};

export const CsrfQL = (message?: string) => {
  return applyDecorators(UseGuards(new CsrfGraphQLGuard(message)));
};
