import Cookie from "cookie";
import { sign } from "cookie-signature";
import Tokens from "csrf";
import { Request, Response } from "express";

interface CookieConfig {
  signed?: boolean;
  key?: string;
  path?: string;
  httpOnly?: boolean;
  maxAge?: number;
  ttl?: number;
}

export interface NestCsrfOptions {
  signed?: boolean;
  key?: string;
  ttl?: number;
}

export interface NestCsrfRequest extends Request {
  secret?: string;
  cookieConfig?: NestCsrfOptions;
  csrfToken?: () => string;
}

const tokenProvider = new Tokens({
  secretLength: 16,
  saltLength: 16,
});

const nestCsrf = (options?: NestCsrfOptions) => {
  const sessionKey = "session";
  const cookieConfig: CookieConfig = {
    signed: false,
    key: "_csrf",
    path: "/",
    httpOnly: true,
    maxAge: options && options.ttl ? options.ttl : 300,
    ...options,
  };
  return function csrf(req: NestCsrfRequest, res: Response, next) {
    let csrfTokenValue = "";
    let secret = getSecretFromRequest(req, sessionKey, cookieConfig);
    if (!secret) {
      secret = tokenProvider.secretSync();
      setSecret(req, res, sessionKey, secret, cookieConfig);
    }
    req.cookieConfig = cookieConfig;
    req.csrfToken = () => {
      if (csrfTokenValue) return csrfTokenValue;
      csrfTokenValue = tokenProvider.create(secret);
      return csrfTokenValue;
    };
    next();
  };
};

const getSecretFromRequest = (
  req: NestCsrfRequest,
  sessionKey: string,
  cookie: CookieConfig
) => {
  var bag = getSecretBag(req, sessionKey, cookie);
  var key = cookie ? cookie.key : "csrfSecret";
  if (!bag) {
    return false;
  }
  return bag[key];
};

const getCsrfFromRequest = (req: NestCsrfRequest) => {
  return (
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    req.headers["csrf-token"] ||
    req.headers["xsrf-token"] ||
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"]
  );
};

const verify = (secret, token) => {
  return tokenProvider.verify(secret, token);
};

const setCookie = (res, name, value, options) => {
  const data = Cookie.serialize(name, value, options);
  const prev = res.getHeader("set-cookie") || [];
  const header = Array.isArray(prev) ? prev.concat(data) : [prev, data];

  res.setHeader("set-cookie", header);
};

const setSecret = (
  req: NestCsrfRequest,
  res,
  sessionKey: string,
  value: string,
  cookie: CookieConfig
) => {
  if (cookie) {
    if (cookie.signed) {
      value = "s:" + sign(value, req.secret);
    }
    setCookie(res, cookie.key, value, cookie);
  } else {
    req[sessionKey].csrfSecret = value;
  }
};

const getSecretBag = (
  req: NestCsrfRequest,
  sessionKey: string,
  cookie: CookieConfig
) => {
  if (cookie) {
    var cookieKey = cookie.signed ? "signedCookies" : "cookies";
    return req[cookieKey];
  } else {
    return req[sessionKey];
  }
};

export { nestCsrf, getSecretFromRequest, getCsrfFromRequest, verify };
