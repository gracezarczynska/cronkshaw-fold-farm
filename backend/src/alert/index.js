const axios = require('axios');

const webhookUrl = process.env.SLACK_WEBHOOK;

const sendMessage = async message =>
  axios.post(webhookUrl, message, {
    headers: { 'Content-Type': 'application/json' }
  });

const createSlackMessage = (error, { correlationName, id }, message) => ({
  icon_emoji: ':sheep:',
  attachments: [
    {
      fallback: message,
      text: message,
      fields: [
        {
          title: 'CorrelationId',
          value: `${correlationName}: ${id}`,
          short: true
        },
        { title: 'Error', value: error.message, short: true }
      ]
    }
  ]
});

const sendAlert = async (error, correlationObject, message) => {
  const createdMessage = createSlackMessage(error, correlationObject, message);
  await sendMessage(createdMessage);
};

module.exports = {
  sendMessage,
  createSlackMessage,
  sendAlert
};
