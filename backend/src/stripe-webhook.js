const stripe = require('./stripe');
const { transport, makeANiceEmail } = require('./mail');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const db = require('./db');

const paymentSucceeded = data => {
    return transport.sendMail({
        from: 'dot@cronkshawfoldfarm.co.uk',
        to: 'm.zarczynska@gmail.com',
        subject: 'This months subscription payment',
        html: makeANiceEmail(`Thanks for buying our delicious eggs!
        \n\n
        This month you have paid ${data.amount_paid} ${data.currency}`)
      });
}

const paymentFailed = async data => {
    return transport.sendMail({
        from: 'dot@cronkshawfoldfarm.co.uk',
        to: 'm.zarczynska@gmail.com', //change to data.email
        subject: 'This months payment has failed',
        html: makeANiceEmail(`We have noticed that there was a problem with your latest payment.
        \n\n
        Please update your payment details <a href="${process.env.FRONTEND_URL}/update">Here</a>`)
      });
}

const stripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;
  
    try {
      event = await stripe.webhooks.constructEvent(request.body, sig, 'whsec_T2n84LPNBbSQJgu2Kt2NUTo5r3Q25UGu');
    }
    catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'invoice.payment_succeeded':
          await paymentSucceeded(event.data.object);
          console.log('invoice payment succeeded', event.data.object)
          break;
        case 'invoice.payment_failed':
          await paymentFailed(event.data.object);
          break;
        default:
          return response.status(400).end();
      }
    
      response.json({received: true});
}

module.exports = stripeWebhook;