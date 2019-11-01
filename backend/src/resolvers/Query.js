const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  farms: forwardTo('db'),
  farm: forwardTo('db'),
  products: forwardTo('db'),
  product: forwardTo('db'),
  enrollment: forwardTo('db'),
  enrollments: forwardTo('db'),
  overrides(parent, args, ctx, info) {
    if(!ctx.request.userId) {
      throw new Error('You must be logged in');
    } 
    hasPermission(ctx.request.user, ['ADMIN', 'FARMER']);
    return ctx.db.query.overrides({}, info);
  },
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
};

module.exports = Query;
