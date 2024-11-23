const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'NewPassword',
    database: 'your_database_name'
});

// POST route to handle form submission
app.post('/add_driver', (req, res) => {
    const { first_name, last_name, birth_date, country_code, driver_code } = req.body;

    const query = `
        INSERT INTO drivers (first_name, last_name, birth_date, country_code, driver_code)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(query, [first_name, last_name, birth_date, country_code, driver_code], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving driver to database');
        } else {
            res.status(200).send('Driver added successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});