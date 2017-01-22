'use strict';

const Roles = require('koa-roles');
const path = require('path');

module.exports = app => {
  /**
   * load role define from `config/role.js`
   *
   * @member {Role} Application#role
   * @example
   *
   * ```javascript
   * // use build-int `user` role to detect login status
   * const userRole = app.role.can('user');
   * app.get('/profile', userRole, 'profile.index');
   * ```
   */

  app.role = new Roles(app.config.userrole);
  // load config from `role.js`
  app.loader.getLoadUnits().forEach(unit => (
    app.loader.loadFile(path.join(unit.path, 'config/role.js'))
  ));
};
