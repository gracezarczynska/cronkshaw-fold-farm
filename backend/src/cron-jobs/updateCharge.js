const stripe = require('../stripe');
const isItSubscriptionDay = require('../isItSubscriptionDay');
const alert = require('../alert');
const moment = require('moment');
const dateFns = require('date-fns');
const { transport, makeANiceEmail } = require('../mail');

const updateCharge = async subscriptions => {
  //get all subscriptions
  const todaysSubscriptions = subscriptions
    .map(subscription => JSON.parse(JSON.stringify(subscription)))
    .filter(subscription => {
      return isItSubscriptionDay(subscription, moment(), 2);
    });
  
  const finalSubscriptionSet = [];
  
  todaysSubscriptions.forEach(
    (subscription) => {
      if (subscription.overrides.length) {
        for(const override of subscription.overrides) {
          if (
            dateFns.isWithinRange(
              moment(),
              override.startDate,
              override.endDate
            ) &&
            override.status === 'approved'
          ) {
            finalSubscriptionSet.push({ ...subscription, quantity: override.quantity });
            break;
          }
        }
      } else {
        finalSubscriptionSet.push(subscription);
      }
    }
  );
  const headerStyle = `"background-color: #f29d12; padding: 15px;
  text-align: left; border: 1px solid black; color: #222222"`;

  let subscriptionMail = `<table style=
    "width: 100%; 
    border: 1px solid #222222; 
    border-collapse: collapse; 
    color: #EDEDED"
    >
    <tr>
      <th style=${headerStyle}>Name</th>
      <th style=${headerStyle}>Address1</th> 
      <th style=${headerStyle}>Address2</th>
      <th style=${headerStyle}>Postcode</th>
      <th style=${headerStyle}>City</th>
      <th style=${headerStyle}>House Picture</th> 
      <th style=${headerStyle}>Drop Off Picture</th>
      <th style=${headerStyle}>Delivery Instructions</th>
      <th style=${headerStyle}>Quantity (box of 6)</th>
    </tr>`;

  const cellStyle = `"padding: 15px;
  text-align: left; border: 1px solid black;"`

  finalSubscriptionSet.map(subscription => {
    subscriptionMail =
      subscriptionMail +
      ` <tr>
        <td style=${cellStyle}>${subscription.user.name}</td>
        <td style=${cellStyle}>${subscription.user.address1}</td>
        <td style=${cellStyle}>${subscription.user.address2}</td>
        <td>${subscription.user.postcode}</td>
        <td style=${cellStyle}>${subscription.user.city}</td>
        <td style=${cellStyle}><a style="color: #f29d12" href=${subscription.user.housePicture}>Link</a></td>
        <td style=${cellStyle}><a style="color: #f29d12" href=${subscription.user.dropOffPicture}>Link</a></td>
        <td style=${cellStyle}>${subscription.user.deliveryInstructions}</td>
        <td style=${cellStyle}>${subscription.quantity} box of 6</td>
      </tr> `;
  });

  subscriptionMail = subscriptionMail + `</table>`;
  const mailRes = await transport.sendMail({
    from: 'no-reply@cronkshawfoldfarm.co.uk',
    to: 'm.zarczynska@gmail.com',
    subject: 'Today\'s deliveries list!',
    html: makeANiceEmail(subscriptionMail)
  });

  finalSubscriptionSet.map(async subscription => {
    if (subscription.subscriptionId) {
      try {
        result = await stripe.usageRecords.create(subscription.subscriptionId, {
          quantity: subscription.quantity,
          timestamp: Math.ceil(Date.now() / 1000)
        });
      } catch (e) {
        sendAlert(
          e,
          { subscriptionName: 'stripeSubscriptionId', id: subscriptionId },
          'Updating charge failed'
        );
        console.log('error here', e);
      }
    }
  });
};

module.exports = updateCharge;
