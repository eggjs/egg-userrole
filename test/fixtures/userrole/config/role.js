'use strict';

module.exports = function(app) {
  app.role.use('admin', ctx => ctx.user && ctx.user.isAdmin);
};
