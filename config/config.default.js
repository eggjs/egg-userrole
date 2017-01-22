'use strict';

exports.userrole = {
  failureHandler(action) {
    if (this.roleFailureHandler) {
      return this.roleFailureHandler(action);
    }
    defaultFailureHandler(this, action);
  },
};

function defaultFailureHandler(ctx, action) {
  const message = `Forbidden, required role: ${action}`;
  ctx.status = 403;
  if (ctx.acceptJSON) {
    ctx.body = {
      message,
      stat: 'deny',
    };
  } else {
    ctx.body = message;
  }
}
