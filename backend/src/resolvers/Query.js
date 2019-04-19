const { forwardTo } = require('prisma-binding');

const Query = {
  farms: forwardTo('db'),
  farm: forwardTo('db'),
  products: forwardTo('db'),
  product: forwardTo('db'),
  subscription: forwardTo('db'),
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
