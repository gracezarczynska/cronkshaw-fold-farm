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

  let subscriptionMail = `<table><tr>
    <th>Name</th>
    <th>Address1</th> 
    <th>Address2</th>
    <th>Postcode</th>
    <th>City</th>
    <th>House Picture</th> 
    <th>Drop Off Picture</th>
    <th>Delivery Instructions </th>
    <th>Quantity (box of 6)</th>
  </tr>`;

  finalSubscriptionSet.map(subscription => {
    subscriptionMail =
      subscriptionMail +
      ` <tr>
        <td>${subscription.user.name}</td>
        <td>${subscription.user.address1}</td>
        <td>${subscription.user.address2}</td>
        <td>${subscription.user.postcode}</td>
        <td>${subscription.user.city}</td>
        <td><a href=${subscription.user.housePicture}>Link</a></td>
        <td><a href=${subscription.user.dropOffPicture}>Link</a></td>
        <td>${subscription.user.deliveryInstructions}</td>
        <td>${subscription.quantity} box of 6</td>
      </tr> `;
  });

  subscriptionMail = subscriptionMail + `</table>`;
  const mailRes = await transport.sendMail({
    from: 'info@graceful-designs.co.uk',
    to: 'dot@cronkshawfoldfarm.co.uk',
    subject: 'Today is delivery day!',
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
