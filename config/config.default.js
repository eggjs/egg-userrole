'use strict';

exports.userrole = {
  failureHandler(ctx, action) {
    if (ctx.roleFailureHandler) {
      return ctx.roleFailureHandler(action);
    }
    defaultFailureHandler(ctx, action);
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
