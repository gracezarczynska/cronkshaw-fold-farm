const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

require('dotenv').config({ path: 'variables.env' });
const cron = require('./cron-jobs');
const createServer = require('./createServer');
const db = require('./db');
const stripeWebhook = require('./stripe-webhook');

const server = createServer();

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name, active }'
  );
  req.user = user;
  next();
});

server.express.use('/api/stripe/webhooks', bodyParser.raw({type: 'application/json'}), (req, res) => {
  stripeWebhook(req, res);
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port} and the date is ${Date.now()}`);
  }
);
