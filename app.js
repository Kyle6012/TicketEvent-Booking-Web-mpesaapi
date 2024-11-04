const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/db');
const { initiateMpesaPayment } = require('./routes/mpesa');
const { sendTicketEmail } = require('./routes/email');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Render home page
app.get('/', (req, res) => {
  res.render('index');
});

// Ticket purchase endpoint
app.post('/buy-ticket', async (req, res) => {
  const { phoneNumber, email, amount } = req.body;

  try {
    const response = await initiateMpesaPayment(phoneNumber, amount);
    if (response.data.ResponseCode === "0") {
      res.render('confirmation', { message: "Payment initiated. Please complete the payment on your MPESA account." });
    } else {
      throw new Error("Payment initiation failed.");
    }
  } catch (error) {
    res.render('error', { message: error.message });
  }
});

// MPESA callback endpoint
app.post('/callback', (req, res) => {
  const callbackData = req.body.Body.stkCallback;
  
  if (callbackData.ResultCode === 0) {
    const ticketNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    const { phoneNumber, email, amount } = req.body;

    db.run(`INSERT INTO tickets (phoneNumber, email, amount, ticketNumber) VALUES (?, ?, ?, ?)`,
      [phoneNumber, email, amount, ticketNumber],
      async (err) => {
        if (err) return console.error(err.message);
        
        await sendTicketEmail(email, ticketNumber);
        console.log(`Ticket sent to ${email}`);
      }
    );
  }
  res.sendStatus(200);
});

// Error route
app.get('/error', (req, res) => {
  res.render('error', { message: "An error occurred during payment processing." });
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
