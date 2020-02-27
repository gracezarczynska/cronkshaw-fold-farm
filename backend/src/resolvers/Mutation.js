const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendAlert } = require('../alert');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission, calcTotal, getEnrollmentDates } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
  async signup(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }

    if (args.email.toLowerCase() !== args.confirmEmail.toLowerCase()) {
      throw new Error("Yo Emails don't match!");
    }
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    let stripeUser;

    try {
      stripeUser = await stripe.customers.create({
        email: args.email
      });
    } catch (e) {
      sendAlert(
        e,
        { subscriptionName: 'email', id: args.email },
        'Stripe customer creation failed'
      );
      throw new Error(e);
    }
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          email: args.email,
          surname: args.surname,
          name: args.name,
          password,
          permissions: { set: ['USER'] },
          stripeId: stripeUser.id
        }
      },
      info
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
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
          id: args.id
        }
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
          id: args.id
        }
      },
      info
    );
  },

  async sendEmailAllEnrollments(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }

    // check if they have the right permissions
    //
    const enrollments = await ctx.db.query.enrollments({}, `{ id user { email } }`);
    enrollments.map(async enrollment => {
      const email = await transport.sendMail({
        from: 'dot@cronkshawfoldfarm.co.uk',
        to: enrollment.user.email,
        subject: 'Note from your farmer',
        html: makeANiceEmail(args.emailText)
      });

      return email;
    });

    return { message: 'Success' };
  },

  async createEnrollment(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in');
    }

    const user = await ctx.db.query.user({ where: { id: userId } });
    const product = await ctx.db.query.product({ where: { id: args.id } });

    const amount = calcTotal({
      subscriptionFrequency: args.subscriptionFrequency,
      quantity: args.quantity,
      price: product.price
    });

    const availableStock = product.availableStock - args.quantity;

    if (availableStock < 0) {
      throw new Error(
        `There is not enough stock for your purchase, there is ${product.availableStock} left available`
      );
    }

    // get user from Stripe or create one if doesnt exist

    let stripeUser;
    let charge;

    try {
      stripeUser = await stripe.customers.retrieve(user.stripeId);
    } catch (e) {
      try {
        stripeUser = await stripe.customers.create({
          email: user.email,
          name: user.name
        });
        ctx.db.mutation.updateUser({
          data: {
            stripeId: stripeUser.id
          },
          where: {
            id: user.id
          }
        });
      } catch (e) {
        sendAlert(
          e,
          { subscriptionName: 'email', id: args.email },
          'Stripe customer creation failed or updating the user'
        );
        throw new Error(e);
      }
    }

    try {
      charge = await stripe.subscriptions.create({
        customer: stripeUser.id,
        items: [
          {
            plan: process.env.STRIPE_PLAN
          }
        ]
      });

      ctx.db.mutation.updateProduct(
        {
          data: {
            availableStock
          },
          where: {
            id: args.id
          }
        },
        info
      );
    } catch (e) {
      sendAlert(
        e,
        { subscriptionName: 'email', id: args.email },
        'Stripe subscription failed'
      );
      throw new Error(e);
    }

    return ctx.db.mutation.createEnrollment(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          product: {
            connect: { id: args.id }
          },
          subscriptionStartDate: args.subscriptionStartDate,
          subscriptionFrequency: args.subscriptionFrequency,
          quantity: args.quantity,
          monthlyPrice: Math.round(amount),
          charge: charge.id,
          subscriptionId: charge.items.data[0].id
        }
      },
      info
    );
  },

  async createOverride(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    let status = 'approved';
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }

    const subscription = await ctx.db.query.enrollment({
      where: {
        id: args.subscriptionId
      }
    });

    if (subscription.quantity === args.quantity) {
      throw new Error('You did not change the quantity');
    } else if (subscription.quantity < args.quantity) {
      const mailRes = await transport.sendMail({
        from: 'info@graceful-designs.co.uk',
        to: 'dot@cronkshawfoldfarm.co.uk',
        subject: 'Subscription Amendment Review Request',
        html: makeANiceEmail(`Someone Requested more of your delicious produce!
        \n\n
        <a href="${process.env.FRONTEND_URL}/review?reviewToken=hello">Click here to review the request</a>`)
      });
      status = 'pending';
    }

    return ctx.db.mutation.createOverride(
      {
        data: {
          subscriptions: {
            connect: { id: args.subscriptionId }
          },
          startDate: args.startDate,
          endDate: args.endDate,
          quantity: args.quantity,
          status
        }
      },
      info
    );
  },

  async updateOverride(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    if (!args.status) {
      throw new Error('You didnt approve or reject');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'FARMER']);
    const message = ctx.request.body.variables.message
      ? `<br><p>Message from your farmer: ${ctx.request.body.variables.message}</p>`
      : '';
    const mailRes = await transport.sendMail({
      from: 'info@graceful-designs.co.uk',
      to: ctx.request.user.email,
      subject: 'Your Amendment Request Response',
      html: makeANiceEmail(`Your amendment request is now ${args.status}!
      \n\n
      ${message}`)
    });

    const updates = { ...args };
    delete updates.id;
    ctx.db.mutation.updateOverride(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such use found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    return user;
  },

  async deleteEnrollment(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    let enrollment = await ctx.db.query.enrollment(
      { where },
      `{ id user { id } overrides { id } charge }`
    );

    // 2. Check if they own that item, or have the permissions
    const ownsEnrollment = enrollment.user.id === ctx.request.userId;

    if (!ownsEnrollment) {
      throw new Error("You don't have permission to do that!");
    }

    try {
      await stripe.subscriptions.update(enrollment.charge, {
        cancel_at_period_end: true
      });
    } catch (e) {
      sendAlert(
        e,
        { subscriptionName: 'enrollmentCharge', id: enrollment.user.id },
        'Didnt delete subscription!!!'
      );
      throw new Error(e);
    }

    // 3. Delete it!
    if (enrollment.overrides) {
      const overrides = JSON.parse(JSON.stringify(enrollment.overrides));
      try {
        overrides.map(async override => {
          await ctx.db.mutation.deleteOverride(
            { where: { id: override.id } },
            info,
            {}
          );
        });
      } catch (e) {
        sendAlert(
          e,
          { subscriptionName: 'userId', id: enrollment.user.id },
          'deleting override failed'
        );
        console.log('CATCH', e);
      }
    }

    enrollment = await ctx.db.query.enrollment(
      { where },
      `{ id user { id } overrides { id } }`
    );

    const deleted = await ctx.db.mutation.deleteEnrollment(
      {
        where: {
          id: enrollment.id
        }
      },
      info,
      {}
    );

    return deleted;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye' };
  },

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });

    const mailRes = await transport.sendMail({
      from: 'do-not-reply@graceful-designs.co.uk',
      to: user.email,
      subject: 'Your Password Reset',
      html: makeANiceEmail(`Your Password Reset is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset your Password</a>`)
    });

    return { message: 'Thanks' };
  },

  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return updatedUser;
  }
};

module.exports = Mutations;
