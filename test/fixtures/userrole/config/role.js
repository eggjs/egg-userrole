'use strict';

module.exports = function(app) {
  app.role.use('admin', function() {
    return this.user && this.user.isAdmin;
  });
};
