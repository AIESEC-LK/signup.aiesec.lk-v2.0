const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Hosted image URLs
const emailBgURL = 'https://lh3.googleusercontent.com/d/1euiZtTaWUuzeMJ2RCmj-Jyk4tr0sh7pi';
const aiesecManURL = 'https://lh3.googleusercontent.com/d/1jSkE3u8A1d1ZpIO7OQBcZSnDXmeoqAoU';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
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
        subject: 'Thank you for Signing up',
        html: `
        <div style="background-color: #f5f5f5; font-family: Arial, sans-serif;">
            <div style="background-image: url('${emailBgURL}'); background-size: cover; background-position: center; padding: 20px 150px;">
                <div style="background-color: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 40px; text-align: center;">
                    <img src="${aiesecManURL}" style="width: auto; height: 20vh;" alt="AIESEC Logo" />
                    <h1 style="color: #007bff; font-size: 2.5rem; margin: 20px 0;">Thank you for signing up!</h1>
                    <h2 style="color: #6c757d; font-size: 1.5rem; margin-bottom: 20px;">Your account has been successfully created.</h2>
                    <p style="color: #6c757d; font-size: 1rem; line-height: 1.5;">
                        Explore the opportunities waiting for you. IoT devices are pieces of hardware that can be embedded into other devices, such as sensors, actuators, appliances, or machines. They can be used in a variety of settings, including the home, industrial equipment, and medical devices.
                    </p>
                    <a href="https://opportunities.aiesec.org" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 1rem;">
                        Explore Opportunities
                    </a>
                </div>
            </div>
            <div style="padding: 20px 150px; text-align: center;">
                <p style="color: #6c757d; font-size: 1rem;">
                    If you have any questions, please email us at <a href="mailto:hrdivision@aiesec.org" style="color: #007bff; text-decoration: underline;">hrdivision@aiesec.org</a> or visit our <a href="https://www.aiesec.lk/faqs" style="color: #007bff; text-decoration: underline;">FAQs</a>.
                </p>
                <p style="color: #6c757d; font-size: 1rem; margin-top: 20px;">Connect with us:</p>
                <a href="https://www.linkedin.com/company/aieseclk/" style="margin-right: 20px;"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 24px;" /></a>
                <a href="https://www.instagram.com/aiesecinsrilanka/" style="margin-right: 20px;"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="width: 24px;" /></a>
                <a href="https://web.facebook.com/AIESECLK/"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px;" /></a>
            </div>
        </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

/** Please remove this database connection during the production */

/* ######################### TEST DATABASE CONNECTION ################################## */
/*
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
                console.error('Failed to insert data:', error);
                return res.status(500).json({ message: 'Failed to insert user data' });
            }
            res.status(200).json({ message: 'User inserted successfully', data: results });
        }
    );
});

// Get all users route
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Failed to retrieve users:', error);
            return res.status(500).json({ message: 'Failed to retrieve users' });
        }
        res.status(200).json({ message: 'Users retrieved successfully', data: results });
    });
});
*/

/* ################### TEST DATABASE CONNECTION ################################## */

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
