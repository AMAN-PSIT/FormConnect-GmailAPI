import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import { google } from 'googleapis';
import { Buffer } from 'buffer';


const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// MongoDB schema and model
const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  reasonForVisit: String,
  description: String,
  address: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

// Middleware
app.use(express.json());
app.use(cors());

// Gmail API setup
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

const sendEmail = async (auth, bookingData) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const from = "chikitshak.app@gmail.com";
  const to = bookingData.email;
  const subject = 'Booking Confirmation';
  const body = 'Your booking has been received successfully.';

  const message = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    `From: ${from}\n`,
    `To: ${to}\n`,
    `Subject: ${subject}\n\n`,
    body,
].join('');


  const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Routes
app.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    const booking = new Booking(bookingData);
    await booking.save();

    // Gmail API authorization
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
      oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    } else {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const code = ''; // Enter the code obtained from the authorization URL
      const token = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(token.tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token.tokens));
    }

    // Send email
    await sendEmail(oAuth2Client, bookingData);

    res.status(201).json({ message: 'Booking saved and email sent successfully' });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'An error occurred while saving the booking' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
