const cron = require('node-cron');
const updateCharge = require('./updateCharge');
const db = require('../db');

const cronJobs = cron.schedule('0 9 * * 2', async () => {
  const subscriptions = await db.query.enrollments();
  updateCharge(subscriptions);
});

module.exports = cronJobs;
