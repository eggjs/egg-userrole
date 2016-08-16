'use strict';

const Roles = require('koa-roles');
const path = require('path');

const ROLE = Symbol('Application#role');

module.exports = {
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
  get role() {
    if (!this[ROLE]) {
      this[ROLE] = new Roles(this.config.userrole);

      // 默认 user role
      this[ROLE].use('user', function() {
        return !!this.user;
      });

      // 加载 role.js 配置
      this.loader.getLoadUnits().forEach(unit => (
        this.loader.loadFile(path.join(unit.path, 'config/role.js'))
      ));
    }
    return this[ROLE];
  },
};
