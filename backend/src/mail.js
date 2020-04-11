const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

const makeANiceEmail = text => `
  <div className="email" style="
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
    text-align: center;
    background-color: #2f2e2e;
    color: #EDEDED;
  ">
    <div style="width: 100%; background-color: #f29d12; height: 200px; color: #222222; text-align: center; padding-top: 90px"><h1>Roundy</h1></h1></div>
    <div style="padding: 20px">
      <h2>Hello There!</h2>
      <p>${text}</p>

      <p>Dot</p>
    </div>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
