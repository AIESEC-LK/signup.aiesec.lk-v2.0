const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Sample endpoint for form submission
app.post('/api/signup', (req, res) => {
    const { firstName, lastName, email, password, contactNumber, howFoundUs, yearOfStudy, permission } = req.body;
    
    // Ideally, you would save the data to a database
    console.log({
        firstName,
        lastName,
        email,
        password,
        contactNumber,
        howFoundUs,
        yearOfStudy,
        permission
    });

    res.status(200).json({ message: 'Signup Successful!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
