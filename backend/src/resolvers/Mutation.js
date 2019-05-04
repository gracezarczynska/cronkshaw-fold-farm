const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { transport, makeANiceEmail } = require('../mail');

const Mutations = {

  async signup(parent, args, ctx, info) {

    // TODO
    // console.log(args);
    // if(args.password !== args.confirmPassword) {
    //   throw new Error('Yo Passwords don\'t match!');
    // }

    // if(args.email.toLowerCase() !== args.confirmEmail.toLowerCase()) {
    //   throw new Error('Yo Emails don\'t match!');
    // }
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },

  updateUser(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateUser(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  updateProduct(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateProduct(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async createEnrollment(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }
    // 2. Query the users current cart
    const product = await ctx.db.query.product( { where: { id: args.id }} );

    const availableStock = product.availableStock - args.quantity;

    if(availableStock < 0) {
      throw new Error(`There is not enough stock for your purchase, there is ${product.availableStock} left available`);
    }

    ctx.db.mutation.updateProduct(
      {
        data: {
          availableStock
        },
        where: {
          id: args.id,
        },
      },
      info
    );

    // const [existingSubscription] = await ctx.db.query.enrollment({
    //   where: {
    //     user: { id: userId },
    //     product: { id: args.id },
    //   },
    // });
    
    // 3. Check if that item is already in their cart and increment by 1 if it is
    // if (existingSubscription) {
    //   console.log('This item is already in their cart');
    //   return ctx.db.mutation.updateEnrollment(
    //     {
    //       where: { id: existingSubscription.id },
    //       data: { quantity: existingSubscription.quantity + 1 },
    //     },
    //     info
    //   );
    // }

    return ctx.db.mutation.createEnrollment(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          product: {
            connect: { id: args.id },
          },
          subscriptionStartDate: args.subscriptionStartDate,
          subscriptionFrequency: args.subscriptionFrequency,
          quantity: args.quantity
        },
      },
      info
    );
  },

  async createOverride(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }

    return ctx.db.mutation.createOverride(
      {
        data: {
          subscription: {
            connect: { id: args.id },
          },
          startDate: args.startDate,
          endDate: args.endDate,
          quantity: args.quantity,
          cancel: args.cancel
        },
      },
      info
    );
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email }});
    if(!user) {
      throw new Error(`No such use found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: "Goodbye" };
  },

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if(!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })

    const mailRes = await transport.sendMail({
      from: 'info@graceful-designs.co.uk',
      to: user.email,
      subject: 'Your Password Reset',
      html: makeANiceEmail(`Your Password Reset is here!
      \n\n
      <a href="${process.env
        .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset your Password</a>`),
    });

    return { message: 'Thanks' };
  },

  async resetPassword(parent, args, ctx, info) {
    if(args.password !== args.confirmPassword) {
      throw new Error('Yo Passwords don\'t match!');
    }

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if(!user) {
      throw new Error('This token is either invalid or expired!');
    }

    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return updatedUser;

  }
};

module.exports = Mutations;
