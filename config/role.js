'use strict';

module.exports = app => {
  app.role.use('user', function() {
    return !!this.user;
  });
};
