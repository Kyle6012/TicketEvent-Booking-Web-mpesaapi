const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendTicketEmail = (email, ticketNumber) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Gala Ticket',
    text: `Thank you for purchasing a ticket. Your ticket number is: ${ticketNumber}`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendTicketEmail };
