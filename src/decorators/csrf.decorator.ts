import { applyDecorators, UseGuards } from "@nestjs/common";
import { CsrfGuard } from "../guards/csrf.guard";

export const Csrf = () => {
  return applyDecorators(UseGuards(CsrfGuard));
};
