const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const email = 'trujillo.santiago@correounivalle.edu.co';

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_AUTH_CLIENT_ID2,
  process.env.GOOGLE_AUTH_CLIENT_SECRET2
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
});

router.post('/noti', async (req, res) => {
  const { feedback } = req.body;
  console.log("feedback", feedback);

  if (!feedback) {
    return res.status(400).send('Feedback is required');
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: email,
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID2,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET2,
        refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    let mailOptions = {
      from: email,
      to: email,
      subject: 'Feedback Usuario - Lyrics Checker',
      text: feedback
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false });
  }
});

module.exports = router;
