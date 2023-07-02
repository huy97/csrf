# Nestjs CSRF token validator

## Table of Contents

- [About](#about)
- [Usage](#usage)
- [How to verify csrf token](#how-to-verify-csrf-token)
- [Restful API Setup](#restful-api-setup)
- [GraphQL Setup](#graphql-setup)

## About

Nestjs CSRF protection middleware.
If you have questions on how this module is implemented, please read [Understanding CSRF](https://github.com/pillarjs/understanding-csrf).

### Deps version

- current -> @nestjs/common ^10.0
- 1.0.7 -> @nestjs/common ^9.4
- 1.0.2 -> @nestjs/common ^7.6

### Prerequisites

Requires either a session middleware or cookie-parser to be initialized first, and need enableCors.

```javascript
app.use(cookieParser());
```

### Installing

This is a Node.js module available through the npm registry. Installation is done using the npm install command:

```
$ npm install ncsrf --save
```

or

```
$ yarn add ncsrf
```

## Usage

### Import in _main.ts_ to enable the middleware globally

```javascript
import { nestCsrf, CsrfFilter } from "ncsrf";
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(nestCsrf());
```

### nestCsrf([options])

- signed - indicates if the cookie should be signed (defaults to false).
- key - the name of the cookie to use to store the token secret (defaults to '\_csrf').
- ttl - The time to live of the cookie use to store the token secret (default 300s).

### Custom exception message

```javascript
app.useGlobalFilters(new CsrfFilter());
```

Or use your custom exception filter by catch 2 class

```javascript
CsrfInvalidException;
```

And

```javascript
CsrfNotFoundException;
```

### How to verify csrf token

HTTP Request must be have at least one of these headers:

- csrf-token
- xsrf-token
- x-csrf-token
- x-xsrf-token  
  or query param:
- \_csrf  
  or body param:
- \_csrf

## Restful API Setup

**Important**: Request must be sent with `withCredentials` set to `true` to allow cookies to be sent from the frontend or `credentials` set to `include` in fetch API.

### Generate token here

```javascript
  @Get('/token')
  getCsrfToken(@Req() req): any {
    return {
      token: req.csrfToken()
    }
  }
```

### Protected route with csrf

```javascript
  import {Csrf} from "ncsrf";
  ...
  @Post()
  @Csrf()
  needProtect(): string{
    return "Protected!";
  }
```

### Protected route with csrf and custom exception message

```javascript
  import {Csrf} from "ncsrf";
  ...
  @Post()
  @Csrf("Custom exception message")
  needProtect(): string{
    return "Protected!";
  }
```

## GraphQL Setup

**Important**: Request must be sent with `withCredentials` set to `true` to allow cookies to be sent from the frontend or `credentials` set to `include` in fetch API.

### Generate token here

```javascript
  @Query((returns) => string, { name: 'getToken', nullable: false })
  async getUsers(@Context('req') req: any) {
    return req?.csrfToken();
  }
```

### Protected route with csrf

```javascript
  import {CsrfQL} from "ncsrf";
  ...
  @Mutation((returns) => string, { name: 'needProtect', nullable: false })
  @CsrfQL()
  needProtect(): string{
    return "Protected!";
  }
```

### Protected route with csrf and custom exception message

```javascript
  import {CsrfQL} from "ncsrf";
  ...
  @Mutation((returns) => string, { name: 'needProtect', nullable: false })
  @CsrfQL("Custom exception message")
  needProtect(): string{
    return "Protected!";
  }
```

### Issue & contribute

- If you have any issue, please create an issue.
- If you want to contribute, please create a pull request.

### Thank you for using this module.
