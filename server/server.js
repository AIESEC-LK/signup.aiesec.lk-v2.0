const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Nodemailer configuration
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

// Email route
app.post('/api/email', (req, res) => {
    const { email, name } = req.body;
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Thank you for Signing up",
        text: `Hello ${name}, Thank you for signing up with us. We will keep you updated with the latest news and updates.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          res.status(500).json({ message: "Failed to send email" });
        } else {
          console.log("Email sent: ", info.response);
          res.status(200).json({ message: "Email sent successfully" });
        }
    });
});

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aiesec_sign_up',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// User insertion route
app.post('/api/users', (req, res) => {
    const {
        first_name,
        last_name,
        email,
        country_code,
        contact_number,
        password,
        alignment_id,
        lc,
        referral_type,
        allow_phone_communication,
        allow_email_communication,
        selected_programmes,
    } = req.body;

    const query = `
      INSERT INTO users (first_name, last_name, email, country_code, contact_number, password, alignment_id, lc, referral_type, allow_phone_communication, allow_email_communication, selected_programmes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            first_name,
            last_name,
            email,
            country_code,
            contact_number,
            password,
            alignment_id,
            lc,
            referral_type,
            allow_phone_communication,
            allow_email_communication,
            selected_programmes,
        ],
        (error, results) => {
            if (error) {
                console.error("Failed to insert data:", error);
                return res.status(500).json({ message: "Failed to insert user data" });
            }
            res.status(200).json({ message: "User inserted successfully", data: results });
        }
    );
});

// Get all users route
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (error, results) => {
        if (error) {
            console.error("Failed to retrieve users:", error);
            return res.status(500).json({ message: "Failed to retrieve users" });
        }
        res.status(200).json({ message: "Users retrieved successfully", data: results });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
