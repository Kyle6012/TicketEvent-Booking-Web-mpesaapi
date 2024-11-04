const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const mpesaAuth = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  const buffer = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${buffer}` }
  });
  return data.access_token;
};

const initiateMpesaPayment = async (phoneNumber, amount) => {
  const token = await mpesaAuth();
  const { MPESA_SHORTCODE, MPESA_PASSKEY, CALLBACK_URL } = process.env;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  const paymentData = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: "GalaTicket",
    TransactionDesc: "Payment for Gala Ticket"
  };

  return axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

module.exports = { initiateMpesaPayment };
