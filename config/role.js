'use strict';

module.exports = app => {
  app.role.use('user', ctx => !!ctx.user);
};
