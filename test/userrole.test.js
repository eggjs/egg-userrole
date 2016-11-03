'use strict';

const request = require('supertest');
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
    return request(app.callback())
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
    return request(app.callback())
    .get('/admin?name=suqian.yf')
    .expect(200, 'hello admin');
  });

  it('should GET /user 403 when user not login', () => {
    app.mockContext({
      user: null,
    });
    return request(app.callback())
    .get('/user')
    .expect(403, 'Forbidden, required role: user');
  });

  it('should GET /admin 403 when user is not admin', () => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    return request(app.callback())
    .get('/admin?name=user2')
    .expect(403, 'Forbidden, required role: admin');
  });

  it('should get 403 json format', () => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    return request(app.callback())
    .get('/admin?name=user2&ctoken=foo')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Cookie', 'ctoken=foo')
    .expect(403, {
      message: 'Forbidden, required role: admin',
      stat: 'deny',
    });
  });
});
