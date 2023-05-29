# Nestjs CSRF token validator

## Table of Contents

- [About](#about)
- [Usage](#usage)

## About

Nestjs CSRF protection middleware.
If you have questions on how this module is implemented, please read [Understanding CSRF](https://github.com/pillarjs/understanding-csrf).

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

## Usage <a name = "usage"></a>

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

## Example

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

### Issue & contribute

- If you have any issue, please create an issue.
- If you want to contribute, please create a pull request.

### Thank you for using this module.
