'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/lib/plugins/userrole.test.js', () => {
  let app;
  before(done => {
    app = mm.app({
      baseDir: 'userrole',
      plugin: true,
    });
    app.ready(done);
  });

  afterEach(mm.restore);

  it('should GET /user 200 when user login', done => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    request(app.callback())
    .get('/user?name=user2')
    .expect('hello user2')
    .expect(200, done);
  });

  it('should GET /admin 200 when admin login', done => {
    app.mockContext({
      user: {
        name: 'suqian.yf',
        isAdmin: true,
      },
    });
    request(app.callback())
    .get('/admin?name=suqian.yf')
    .expect('hello admin')
    .expect(200, done);
  });

  it.only('should GET /user 403 when user not login', done => {
    app.mockContext({
      user: null,
    });
    request(app.callback())
    .get('/user')
    .expect('Forbidden, required role: user')
    .expect(403, done);
  });

  it('should GET /admin 403 when user is not admin', done => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    request(app.callback())
    .get('/admin?name=user2')
    .expect('Forbidden, required role: admin')
    .expect(403, done);
  });

  it('should get 403 json format', done => {
    app.mockContext({
      user: {
        name: 'user2',
      },
    });
    request(app.callback())
    .get('/admin?name=user2&ctoken=foo')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Cookie', 'ctoken=foo')
    .expect({
      message: 'Forbidden, required role: admin',
      stat: 'deny',
    })
    .expect(403, done);
  });
});
