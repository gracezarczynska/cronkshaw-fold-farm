const stripe = require('../stripe');
const isItSubscriptionDay = require('../isItSubscriptionDay');

const updateCharge = async subscriptions => {
  //get all subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription =>
    isItSubscriptionDay(subscription, Date.now(), 2)
  );
  filteredSubscriptions.map(async subscription => {
    if (subscription.subscriptionId) {
      try {
        result = await stripe.usageRecords.create(subscription.subscriptionId, {
          quantity: subscription.quantity,
          timestamp: Math.ceil(Date.now() / 1000)
        });
      } catch (e) {
        console.log('error here', e);
      }
    }
  });
};

module.exports = updateCharge;
