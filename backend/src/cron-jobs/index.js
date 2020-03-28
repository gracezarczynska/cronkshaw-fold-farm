const cron = require('node-cron');
const updateCharge = require('./updateCharge');
const db = require('../db');

const cronJobs = cron.schedule('15 14 * * TUE', async () => {
  console.log('here', Date.now());
  const subscriptions = await db.query.enrollments(
    {},
    `{ id quantity subscriptionFrequency subscriptionStartDate overrides { startDate endDate quantity status } user { name surname email address1 address2 postcode city housePicture dropOffPicture deliveryInstructions } subscriptionId  }`
  );
  updateCharge(subscriptions);
});

module.exports = cronJobs;
