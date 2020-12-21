import Cookie from "cookie";
import Tokens from "csrf";
import { sign } from "cookie-signature";

type NestCsrfOptions = {
  signed?: boolean;
  key?: string;
  ttl?: number;
};

const tokenProvider = new Tokens({
  secretLength: 16,
  saltLength: 16,
});

const nestCsrf = (options?: NestCsrfOptions) => {
  const sessionKey = "session";
  const cookieConfig = {
    signed: false,
    key: "_csrf",
    path: "/",
    httpOnly: true,
    maxAge: options && options.ttl ? options.ttl : 300,
    ...options,
  };
  return function csrf(req, res, next) {
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

const getSecretFromRequest = (req, sessionKey, cookie) => {
  var bag = getSecretBag(req, sessionKey, cookie);
  var key = cookie ? cookie.key : "csrfSecret";
  if (!bag) {
    return false;
  }
  return bag[key];
};

const getCsrfFromRequest = (req) => {
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

const setSecret = (req, res, sessionKey, value, cookie) => {
  if (cookie) {
    if (cookie.signed) {
      value = "s:" + sign(value, req.secret);
    }
    setCookie(res, cookie.key, value, cookie);
  } else {
    req[sessionKey].csrfSecret = value;
  }
};

const getSecretBag = (req, sessionKey, cookie) => {
  if (cookie) {
    var cookieKey = cookie.signed ? "signedCookies" : "cookies";
    return req[cookieKey];
  } else {
    return req[sessionKey];
  }
};

export { nestCsrf, getSecretFromRequest, getCsrfFromRequest, verify };
