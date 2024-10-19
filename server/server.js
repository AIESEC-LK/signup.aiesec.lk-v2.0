const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());



const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
});

app.post('/api/email', (req, res) => {
    const {email , name } = req.body;
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Thank you for Signing up",
        text: `Hello ${name}, Thank you for signing up with us. We will keep you updated with the latest news and updates.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
    });

})




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
