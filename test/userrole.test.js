'use strict';

const mm = require('egg-mock');
const path = require('path');

describe('test/lib/plugins/userrole.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'userrole',
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });

  afterEach(mm.restore);

  it('should GET /user 200 when user login', () => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    return app.httpRequest()
      .get('/user?name=user2')
      .expect(200, 'hello user2');
  });

  it('should GET /admin 200 when admin login', () => {
    app.mockContext({
      user: {
        name: 'suqian.yf',
        isAdmin: true,
      },
    });
    return app.httpRequest()
      .get('/admin?name=suqian.yf')
      .expect(200, 'hello admin');
  });

  it('should GET /user 403 when user not login', () => {
    app.mockContext({
      user: null,
    });
    return app.httpRequest()
      .get('/user')
      .expect(403, 'Forbidden, required role: user');
  });

  it('should GET /admin 403 when user is not admin', () => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    return app.httpRequest()
      .get('/admin?name=user2')
      .expect(403, 'Forbidden, required role: admin');
  });

  it('should get 403 with json format when accept json', () => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    return app.httpRequest()
      .get('/admin?name=user2&ctoken=foo')
      .set('Accept', 'application/json')
      .set('Cookie', 'ctoken=foo')
      .expect(403, {
        message: 'Forbidden, required role: admin',
        stat: 'deny',
      });
  });

  it('should get 403 with json format when endsWith json', () => {
    app.mockContext({
      user: null,
    });
    return app.httpRequest()
      .get('/user.json')
      .expect(403, {
        message: 'Forbidden, required role: user',
        stat: 'deny',
      });
  });

  it('should get 403 with json format and custom failureHandler', () => {
    mm(app.role, 'failureHandler', (ctx, action) => {
      ctx.status = 403;
      ctx.body = { message: `Permission denied, required role: ${action}` };
    });
    app.mockContext({
      user: null,
    });
    return app.httpRequest()
      .get('/user.json')
      .expect(403, {
        message: 'Permission denied, required role: user',
      });
  });
});
