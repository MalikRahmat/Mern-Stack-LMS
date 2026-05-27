const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true, // true for port 465 (SSL) - Gmail standard
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: `"LMS Portal Support" <${process.env.EMAIL_USER}>`,
    to: options.email, // personal account
    subject: options.subject,
    html: options.htmlMessage, 
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;