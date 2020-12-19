# @nestjs/csrf

## Table of Contents

- [About](#about)
- [Usage](#usage)

## About <a name = "about"></a>

Nestjs CSRF protection middleware.
If you have questions on how this module is implemented, please read [Understanding CSRF](https://github.com/pillarjs/understanding-csrf).

### Prerequisites

Requires either a session middleware or cookie-parser to be initialized first, and need enableCors.

```
  app.use(cookieParser());
```

### Installing

This is a Node.js module available through the npm registry. Installation is done using the npm install command:

```
$ npm install ncsrf --save
```

## Usage <a name = "usage"></a>

Import in main.ts

```
import {nestCsrf, CsrfFilter} from 'ncsrf';
import cookieParser from 'cookie-parser';
```

Enable CSRF in global

```
  app.use(cookieParser());
  app.use(nestCsrf());
```

Custom exception

```
  app.useGlobalFilters(new CsrfFilter);
```

Generate token here

```
  @Get('/token')
  getCsrfToken(@Req() req): any {
    return {
      token: req.csrfToken()
    }
  }
```

Protected route with csrf

```
  @Post()
  @Csrf()
  needProtect(): string{
    return "Protected!";
  }
```
