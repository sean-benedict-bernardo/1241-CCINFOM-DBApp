const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbrace'
});

// Middleware
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));
app.get('/constructors', (req, res) => {
    const query = 'SELECT constructor_id, name FROM constructor';

    pool.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching constructors from database');
        } else {
            res.status(200).json(results);
        }
    });
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

// Route to fetch constructor data
app.get('/constructors', (req, res) => {
    const query = 'SELECT constructor_id, name FROM constructor';

    pool.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching constructors from database');
        } else {
            res.status(200).json(results);
        }
    });
});

// handle adding a crew member
app.post('/add_crew', (req, res) => {
    const { first_name, last_name, crew_role, constructor_select } = req.body;

    const query = `
        INSERT INTO crew (first_name, last_name, crew_role, constructor_id)
        VALUES (?, ?, ?, ?)
    `;

    pool.query(query, [first_name, last_name, crew_role, constructor_select], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving crew member to database');
        } else {
            res.status(200).send('Crew member added successfully');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});