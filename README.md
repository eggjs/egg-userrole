# egg-userrole

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-userrole.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-userrole
[travis-image]: https://img.shields.io/travis/eggjs/egg-userrole.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-userrole
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-userrole.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-userrole?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-userrole.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-userrole
[snyk-image]: https://snyk.io/test/npm/egg-userrole/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-userrole
[download-image]: https://img.shields.io/npm/dm/egg-userrole.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-userrole

Provide dynamic roles based authorisation. Use [koa-roles](https://github.com/koajs/koa-roles).

## Install

```bash
$ npm i egg-userrole --save
```

## Usage
```javascript
// {app_root}/config/plugin.js
exports.userrole = {
  package: 'egg-userrole',
};
```

> Recommend to use along with custom `userservice` plugin (which provide `ctx.user`).
>
> see [`egg-userservice`](https://github.com/eggjs/egg-userservice) for more info.

### Build-in

`Roles` build-in `failureHandler`:

```javascript
function failureHandler(ctx, action) {
  const message = 'Forbidden, required role: ' + action;
  if (ctx.acceptJSON) {
    ctx.body = {
      message: message,
      stat: 'deny',
    };
  } else {
    ctx.status = 403;
    ctx.body = message;
  }
};
```

Build-in `user` role define:

```javascript
app.role.use('user', ctx => !!ctx.user);
```

### How to custom `failureHandler`

Define `app.role.failureHandler(action)` method in `config/role.js`

- `app/extend/context.js`

```javascript
// {app_root}/config/role.js or {framework_root}/config/role.js
module.exports = app => {
  app.role.failureHandler = function(ctx, action) {
    if (ctx.acceptJSON) {
      ctx.body = { target: loginURL, stat: 'deny' };
    } else {
      ctx.realStatus = 200;
      ctx.redirect(loginURL);
    }
  };
}
```

### How to custom role

```javascript
// {app_root}/config/role.js or {framework_root}/config/role.js
module.exports = function(app) {
  app.role.use('admin', ctx => {
    return ctx.user && ctx.user.isAdmin;
  });

  app.role.use('can write', async ctx => {
    const post = await ctx.service.post.fetch(ctx.request.body.id);
    return ctx.user.name === post.author;
  });
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](https://github.com/eggjs/egg-userrole/blob/master/LICENSE)
