const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // allows any web client to call this basically

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

const pool = mysql.createPool({
    host: "localhost", user: "root", password: "password",
    database: 'dbrace', waitForConnections: true, connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0, enableKeepAlive: true, keepAliveInitialDelay: 0,
    multipleStatements: true
});

const validateQuery = (req, params = []) => {
    // if params is a single string, convert it to an array
    if (typeof params === 'string') params = [params]

    // returns false if any of the query parameters are missing
    for (let i = 0; i < params.length; i++) {
        if (!req.query[params[i]])
            return false;
    }

    return true;
}

app.get('/', async (req, res) => {
    res.send("I'm gonna blow up the moon!!")
})

// View information
app.post('/add-driver', async (req, res) => {
    const { driver_code, first_name, last_name, birth_date, country_code } = req.body;

    if (!driver_code || !first_name || !last_name || !birth_date || !country_code) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const query = `
            INSERT INTO race_crew (first_name, last_name, job_id) VALUES ('${first_name}', '${last_name}', 1);
            SET @race_crew_id = LAST_INSERT_ID();

            INSERT INTO driver_info (driver_code, birth_date, country_id, crew_id) VALUES ('${driver_code}', '${birth_date}', '${country_code}', @race_crew_id);
        `;
        await conn.query(query);
        await conn.commit();
        res.status(200).send({ text: "Driver has been registered successfully!" });
    } catch (err) {
        await conn.rollback();

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ error: "Driver already exists" });
        }

        res.status(500).send({ error: "Driver cannot be registered!" });
    }
});

app.get('/drivers-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const query = `
            SELECT rc.first_name, rc.last_name, di.birth_date, di.country_id, di.driver_code
            FROM driver_info di
            JOIN race_crew rc ON rc.crew_id = di.crew_id;
        `;
        const [rows] = await conn.query(query);

        res.status(200).send(rows);
    } catch (err) {
        console.error('Error retrieving drivers:', err);
        res.status(500).send({ error: "Drivers cannot be retrieved!" });
    }
});

app.get('/driver-details', async (req, res) => {
    const driverCode = req.query.driver_code;
    if (!driverCode) {
        return res.status(400).send({ error: 'driver_code is required' });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            SELECT rc.first_name, rc.last_name, di.birth_date, di.country_id, di.driver_code
            FROM driver_info di
            JOIN race_crew rc ON rc.crew_id = di.crew_id
            WHERE di.driver_code = ?;
        `;
        const [rows] = await conn.query(query, [driverCode]);

        if (rows.length === 0) {
            return res.status(404).send({ error: 'Driver not found' });
        }

        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch driver details' });
    }
});

app.post('/add-constructor', async (req, res) => {
    const { name, year_founded, country_id, engine_manufacturer, constructor_budget } = req.query;

    if (!name || !year_founded || !country_id || !engine_manufacturer || !constructor_budget) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            INSERT INTO constructor (name, year_founded, country_id, engine_manufacturer, constructor_budget)
            VALUES (?, ?, ?, ?, ?);
        `;
        await conn.query(query, [name, year_founded, country_id, engine_manufacturer, constructor_budget]);

        res.status(200).send({ text: "Constructor has been registered successfully!" });
    } catch (err) {
        console.error('Error inserting constructor:', err);
        res.status(500).send({ error: "Constructor cannot be registered!" });
    }
});

app.get('/constructors-list', async (req, res) => {
    const performQuery = async () => {
        const conn = await pool.getConnection();
        try {
            const query = `
                    SELECT  c.constructor_id, c.name, c.year_founded, c.country_id, c.engine_manufacturer, c.constructor_budget
                    FROM    constructor c; `;
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Constructors cannot be retrieved!" }
        }
    }

    if (validateQuery(req)) {
        const data = await performQuery();
        res.status((data.error) ? 404 : 200).send(data);
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/constructor-details', async (req, res) => {
    const constructorId = req.query.constructor_id;
    if (!constructorId) {
        return res.status(400).send({ error: 'constructor_id is required' });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            SELECT constructor_id, name, year_founded, country_id, engine_manufacturer, constructor_budget
            FROM constructor
            WHERE constructor_id = ?;
        `;
        const [rows] = await conn.query(query, [constructorId]);
        conn.release();

        if (rows.length === 0) {
            return res.status(404).send({ error: 'Constructor not found' });
        }

        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch constructor details' });
    }
});

app.post('/add-crew', async (req, res) => {
    const { first_name, last_name, crew_role, constructor_select, contract_start, contract_end, salary, bonus } = req.body;

    if (!first_name || !last_name || !crew_role || !constructor_select || !contract_start || !contract_end || !salary || !bonus) {
        return res.status(404).send({ error: "Missing parameters" });
    }

    if (contract_start >= contract_end) {
        return res.status(404).send({ error: "Contract start date must be before contract end date" });
    }

    if (salary < 0 || bonus < 0) {
        return res.status(404).send({ error: "Salary and bonus must be non-negative" });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Get the last inserted crew_id
        const [result] = await conn.query('SELECT LAST_INSERT_ID() AS crew_id');
        const crew_id = result[0].crew_id;

        // check if crew's potential contract dates overlap
        const query_check = `
            SELECT crew_id FROM contract c
            WHERE crew_id = ${crew_id} 
                AND (DATEDIFF('${contract_start}', contract_end) < 0 
                AND DATEDIFF(contract_start, '${contract_end}') < 0);`;
        const [rows] = await conn.query(query_check);

        if (rows.length > 0) {
            return res.status(404).send({ error: "Crew already has an active contract" });
        }

        // Get job_id from ref_job table
        const [jobResult] = await conn.query('SELECT job_id FROM ref_job WHERE job_title = ?', [crew_role]);
        if (jobResult.length === 0) {
            throw new Error('Invalid crew role');
        }
        const job_id = jobResult[0].job_id;

        // Insert into race_crew table
        const query1 = `
            INSERT INTO race_crew (first_name, last_name, job_id)
            VALUES (?, ?, ?);
        `;
        await conn.query(query1, [first_name, last_name, job_id]);

        // Insert into contract table
        const query2 = `
            INSERT INTO contract (crew_id, constructor_id, contract_start, contract_end, salary, bonus)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await conn.query(query2, [crew_id, constructor_select, contract_start, contract_end, salary, bonus]);

        await conn.commit();
        res.status(200).send({ text: "Crew member has been added successfully!" });
    } catch (err) {
        await conn.rollback();
        console.error('Error adding crew member:', err);
        res.status(500).send({ error: "Crew member cannot be added!" });
    } finally {
        conn.release();
    }
});

app.post('/add-race', async (req, res) => {
    const { race_name, track_location, country_id, race_season, num_laps, race_status, prize_money } = req.body;

    console.log(race_name, track_location, country_id, race_season, num_laps, race_status, prize_money)

    if (!race_name || !track_location || !country_id || !race_season || !num_laps || !race_status || !prize_money) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            INSERT INTO race (race_name, track_location, country_id, race_season, num_laps, race_status, prize_money)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        await conn.query(query, [race_name, track_location, country_id, race_season, num_laps, race_status, prize_money]);
        conn.release();
        res.status(200).send({ text: "Race has been added successfully!" });
    } catch (err) {
        console.error('Error adding race:', err);
        res.status(500).send({ error: "Race cannot be added!" });
    }
});

app.get('/race-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const query = `
            SELECT race_id, race_name, track_location, race_season, num_laps, race_status, prize_money
            FROM race;
        `;
        const [rows] = await conn.query(query);
        res.status(200).send(rows);
    } catch (err) {
        console.error('Error retrieving races:', err);
        res.status(500).send({ error: "Races cannot be retrieved!" });
    }
});

app.get('/race-details', async (req, res) => {
    const raceId = req.query.race_id;
    if (!raceId) {
        return res.status(400).send({ error: 'race_id is required' });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            SELECT race_name, track_location, race_season, num_laps, race_status, prize_money
            FROM race
            WHERE race_id = ?;
        `;
        const [rows] = await conn.query(query, [raceId]);
        conn.release();

        if (rows.length === 0) {
            return res.status(404).send({ error: 'Race not found' });
        }

        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch race details' });
    }
});

app.get('/crew-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const query = `
            SELECT DISTINCT rc.crew_id, rc.first_name, rc.last_name, rj.job_title AS crew_role, c.name AS constructor_name
            FROM race_crew rc
            JOIN ref_job rj ON rc.job_id = rj.job_id
            JOIN contract ct ON rc.crew_id = ct.crew_id
            JOIN constructor c ON ct.constructor_id = c.constructor_id;
        `;
        const [rows] = await conn.query(query);
        res.status(200).send(rows);
    } catch (err) {
        console.error('Error retrieving crew members:', err);
        res.status(500).send({ error: "Crew members cannot be retrieved!" });
    } finally {
        conn.release();
    }
});

app.get('/crew-details', async (req, res) => {
    const crewId = req.query.crew_id;
    if (!crewId) {
        return res.status(400).send({ error: 'crew_id is required' });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            SELECT rc.first_name, rc.last_name, rj.job_title AS crew_role, c.name AS constructor_name
            FROM race_crew rc
            JOIN ref_job rj ON rc.job_id = rj.job_id
            JOIN contract ct ON rc.crew_id = ct.crew_id
            JOIN constructor c ON ct.constructor_id = c.constructor_id
            WHERE rc.crew_id = ?;
        `;
        const [rows] = await conn.query(query, [crewId]);
        conn.release();

        if (rows.length === 0) {
            return res.status(404).send({ error: 'Crew member not found' });
        }

        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch crew member details' });
    }
});

app.get('/country-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT country_id, name FROM REF_countries;');
        res.status(200).send(rows);
    } catch (err) {
        console.error('Error retrieving countries:', err);
        res.status(500).send({ error: "Countries cannot be retrieved!" });
    }
});

app.get('/seasons-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT DISTINCT race_season FROM race;');
        res.status(200).send(rows);
    } catch (err) {
        console.error('Error retrieving seasons:', err);
        res.status(500).send({ error: "Countries cannot be retrieved!" });
    }
})

app.get('/race-details', async (req, res) => {
    const performQuery = async (race_id) => {
        const conn = await pool.getConnection();
        try {
            const query1 = `
            SELECT
            r.race_name,
                r.track_location,
                r.race_season,
                r.num_laps,
                r.race_status,
                r.prize_money
            FROM
                    race r
            WHERE
            r.race_id = ${race_id}; `

            const race_details = await conn.query(query1);
            let race_obj = race_details[0][0]

            const query2 = `
            SELECT
            rs.position,
                d.driver_code,
                CONCAT(UPPER(rc.last_name), ', ', rc.first_name) AS driver_name
            FROM
                    race_stats rs
                    JOIN driver_info d ON rs.driver_code = d.driver_code
                    JOIN race_crew rc ON d.crew_id = rc.crew_id
            WHERE
            rs.race_id = ${race_id}
                ORDER BY
            FIELD(rs.position, 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'DNF'); `

            const positions = await conn.query(query2);
            race_obj.positions = positions[0];

            return race_obj;
        } catch (error) {
            console.log(error);
            return { error: "Race details cannot be retrieved" }
        }
    }


    if (validateQuery(req, ['race_id'])) {
        const data = await performQuery(req.query.race_id)

        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.post('/update-constructor', async (req, res) => {
    const { constructor_id, attribute, new_value } = req.body;

    if (!constructor_id || !attribute || !new_value) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            UPDATE constructor
            SET ${attribute} = ?
            WHERE constructor_id = ?;
        `;
        await conn.query(query, [new_value, constructor_id]);
        conn.release();
        res.status(200).send({ text: "Constructor has been updated successfully!" });
    } catch (err) {
        console.error('Error updating constructor:', err);
        res.status(500).send({ error: "Constructor cannot be updated!" });
    }
});

app.post('/update-driver', async (req, res) => {
    const { driver_code, attribute, new_value } = req.body;

    if (!driver_code || !attribute || !new_value) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        let query;

        if (attribute === 'birth_date' || attribute === 'driver_code') {
            query = `
                UPDATE driver_info
                SET ${attribute} = ?
                WHERE driver_code = ?;
            `;
        } else {
            query = `
                UPDATE race_crew rc
                JOIN driver_info di ON rc.crew_id = di.crew_id
                SET rc.${attribute} = ?
                WHERE di.driver_code = ?;
            `;
        }

        await conn.query(query, [new_value, driver_code]);
        conn.release();
        res.status(200).send({ text: "Driver has been updated successfully!" });
    } catch (err) {
        console.error('Error updating driver:', err);
        res.status(500).send({ error: "Driver cannot be updated!" });
    }
});

app.post('/update-crew', async (req, res) => {
    const { crew_id, attribute, new_value } = req.body;

    if (!crew_id || !attribute || !new_value) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            UPDATE race_crew
            SET ${attribute} = ?
            WHERE crew_id = ?;
        `;
        await conn.query(query, [new_value, crew_id]);
        conn.release();
        res.status(200).send({ text: "Crew member has been updated successfully!" });
    } catch (err) {
        console.error('Error updating crew member:', err);
        res.status(500).send({ error: "Crew member cannot be updated!" });
    }
});

app.post('/update-race', async (req, res) => {
    const { race_id, attribute, new_value } = req.body;

    if (!race_id || !attribute || !new_value) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    try {
        const conn = await pool.getConnection();
        const query = `
            UPDATE race
            SET ${attribute} = ?
            WHERE race_id = ?;
        `;
        await conn.query(query, [new_value, race_id]);
        conn.release();
        res.status(200).send({ text: "Race has been updated successfully!" });
    } catch (err) {
        console.error('Error updating race:', err);
        res.status(500).send({ error: "Race cannot be updated!" });
    }
});

// Transactions
app.post('/finalize-contract', async (req, res) => {
    const { driver_code, constructor_id, current_salary, start_date, end_date, bonus } = req.query;

    if (!driver_code || !constructor_id || !current_salary || !start_date || !end_date || !bonus) {
        return res.status(404).send({ error: "Missing parameters" });
    }

    if (start_date >= end_date) {
        return res.status(404).send({ error: "Contract start date must be before contract end date" });
    }

    if (current_salary < 0 || bonus < 0) {
        return res.status(404).send({ error: "Salary and bonus must be non-negative" });
    }

    const conn = await pool.getConnection();

    const [constructor] = await conn.query('SELECT constructor_budget FROM constructor WHERE constructor_id = ?', [constructor_id]);

    if (current_salary + bonus > constructor.constructor_budget) {
        return res.status(404).send({ error: "Total of salary and bonus must not be greater than team's current budget." });
    }


    try {
        await conn.beginTransaction();

        // check if driver's potential contract dates overlap
        const query_check = `
            SELECT crew_id FROM contract 
            WHERE crew_id = (
                SELECT  crew_id 
                FROM    driver_info 
                WHERE   driver_code = '${driver_code}'
            )
                AND (DATEDIFF('${start_date}', contract_end) < 0 AND DATEDIFF(contract_start, '${end_date}') < 0);`;
        const [rows] = await conn.query(query_check);

        if (rows.length > 0) {
            return res.status(404).send({ error: "Driver already has an active contract" });
        }

        const query = `
            INSERT INTO contract (crew_id, constructor_id, contract_start, contract_end, salary, bonus)
            VALUES (
                (SELECT crew_id FROM driver_info WHERE driver_code = ?),
                ?, ?, ?, ?, ?);
        `;
        await conn.query(query, [driver_code, constructor_id, start_date, end_date, current_salary, bonus]);

        await conn.commit();
        res.status(200).send({ text: "Contract finalized successfully!" });
    } catch (err) {
        await conn.rollback();
        console.error('Error finalizing contract:', err);
        res.status(500).send({ error: "Contract cannot be finalized!" });
    } finally {
        conn.release();
    }
});

// race winnings are done here as well

app.post('/driver-participates-race', async (req, res) => {
    // 
    const performQuery = async (race_id, driver_code, position, penalty, remarks) => {
        const conn = await pool.getConnection();
        try {
            // validates if driver can be added
            const query1 = `SELECT position FROM race_stats WHERE race_id = ${race_id};`
            let [taken_positions] = await conn.query(query1);
            taken_positions = taken_positions.map((obj) => { return obj.position })
            if (taken_positions.length >= 20) {
                return { error: "Race has too many drivers encoded already" }
            } else if (taken_positions.includes(position) && position != 'DNF') {
                return { error: "Another driver already has that position" }
            } else {
                // default value for penalty and remarks
                remarks = (remarks !== "") ? remarks : "Clear Race";

                const query = `
                INSERT INTO race_stats (race_id, driver_code, position, penalty, remarks)
                VALUES (${race_id}, '${driver_code}', '${position}', ${penalty}, '${remarks}');

                UPDATE race r
                SET r.race_status = 'Finished'
                WHERE r.race_id = ${race_id};
                
                UPDATE contract ct
                JOIN race_crew rc ON ct.crew_id = rc.crew_id
                JOIN driver_info di ON rc.crew_id = di.crew_id
                JOIN race_stats rs ON di.driver_code = rs.driver_code AND rs.position = 'P1'
                JOIN race r ON rs.race_id = r.race_id AND r.race_id = ${race_id}
                SET ct.bonus = ct.bonus + r.prize_money;`;
                await conn.query(query);
                return { text: `Race result have been encoded successfully!` };
            }
        } catch (err) {
            return { error: "Error with encoding race results" }
        }
    }

    if (validateQuery(req, ['race_id', 'race_id', 'driver_code', 'position', 'penalty', 'remarks'])) {
        const data = await performQuery(req.query.race_id, req.query.driver_code, req.query.position, req.query.penalty, req.query.remarks)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.post('/constructor-participates-championship', async (req, res) => {
    const { race_id, constructor_id } = req.body;

    if (!race_id || !constructor_id) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    const conn = await pool.getConnection();
    try {
        const query1 = `
            SELECT
                SUM(pa.points) AS total_points
            FROM REF_points_awarded pa
                     JOIN race_stats rs ON pa.position = rs.position
                     JOIN driver_info di ON rs.driver_code = di.driver_code
                     JOIN race r ON rs.race_id = r.race_id
                     JOIN race_crew rc ON di.crew_id = rc.crew_id
                     JOIN contract ct ON rc.crew_id = ct.crew_id
            WHERE r.race_season = (SELECT race_season FROM race WHERE race_id = ?) AND constructor_id = ?
            ORDER BY total_points DESC; `

        const [results] = await conn.query(query1, [race_id, constructor_id]);

        // find index of the constructor in the results
        const constructorIndex = results.findIndex((result) => result.constructor_id === constructor_id);

        const new_budget = constructorIndex * 1000000;
        const bonus = constructorIndex * 1000;
        const query2 = `
                    UPDATE  constructor
                    SET     constructor_budget = ?
                    WHERE   constructor_id = ?;
                    UPDATE contract ct
                    JOIN constructor c ON ct.constructor_id = c.constructor_id
                    SET ct.salary = ct.salary + ?
                    WHERE constructor_id = ?
`
        await conn.query(query2, [new_budget, constructor_id, bonus, constructor_id]);

        res.status(200).send({ text: "Constructor budgets have been updated!" });
    } catch (err) {
        await conn.rollback();
        console.error('Error updating constructor participation:', err);
        res.status(500).send({ error: "Constructor participation cannot be updated!" });
    } finally {
        conn.release();
    }
});

// Reports

app.get('/driver-performance', async (req, res) => {
    const performQuery = async (driver_code, season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            SELECT
            CONCAT(rc.first_name, ' ', rc.last_name) AS full_name,
            ctry.name, c.name AS constructor_name,
            SUM(pa.points) AS total_points,
            AVG(rs.position) AS average_position,
            SUM(r.num_laps) AS total_laps_finished,
            SUM(rs.position = 'P1') AS wins,
            SUM(rs.position IN('P1', 'P2', 'P3')) AS podiums,
            COUNT(*) AS total_races,
            SUM(
            CASE WHEN pa.points > (
                SELECT MIN(pa2.points) 
                FROM ref_points_awarded pa2
                JOIN race_stats rs2 ON rs2.position = pa2.position
                JOIN driver_info di2 ON rs2.driver_code = di2.driver_code 
                JOIN race_crew rc2 ON di.crew_id = rc2.crew_id
                JOIN contract ct2 ON rc2.crew_id = ct2.crew_id
                JOIN constructor c2 ON c2.constructor_id = ct2.constructor_id
                WHERE
                    rs2.race_id = rs.race_id AND di2.crew_id != di.crew_id AND c2.constructor_id = c.constructor_id) THEN 1 ELSE 0 END) AS higher_position_than_teammate
            FROM REF_points_awarded pa
            JOIN race_stats rs ON pa.position = rs.position
            JOIN driver_info di ON rs.driver_code = di.driver_code AND di.driver_code = '${driver_code}'
            JOIN ref_countries ctry ON di.country_id = ctry.country_id
            JOIN race r ON rs.race_id = r.race_id AND rs.position != 'DNF' AND r.race_season = ${season}
            JOIN race_crew rc ON di.crew_id = rc.crew_id
            JOIN contract ct ON rc.crew_id = ct.crew_id
            JOIN constructor c ON ct.constructor_id = c.constructor_id
            GROUP BY di.driver_code, rc.first_name, rc.last_name, ctry.name, c.name;`;

            const [rows] = await conn.query(query);
            return rows[0];
        } catch (err) {
            console.log(err);
            return { error: "Driver cannot be retrieved" };
        }
    }

    if (validateQuery(req, ['driver_code', 'season'])) {
        const data = await performQuery(req.query.driver_code, req.query.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/constructor-performance', async (req, res) => {
    const performQuery = async (constructor_id, season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
SELECT c.name,
    SUM(pa.points) AS total_points,
    SUM(
        CASE
                WHEN rs.position = 'P1' THEN 1
                ELSE 0
                END
    ) AS num_wins,
        SUM(
        CASE
            WHEN rs.position IN('P1', 'P2', 'P3') THEN 1
            ELSE 0
            END
        ) AS num_podiums,
        SUM(r.num_laps) AS total_laps,
            AVG(
                CASE
            WHEN rs.position = 'P1' THEN 1
            WHEN rs.position = 'P2' THEN 2
            WHEN rs.position = 'P3' THEN 3
            WHEN rs.position = 'P4' THEN 4
            WHEN rs.position = 'P5' THEN 5
            WHEN rs.position = 'P6' THEN 6
            WHEN rs.position = 'P7' THEN 7
            WHEN rs.position = 'P8' THEN 8
            WHEN rs.position = 'P9' THEN 9
            WHEN rs.position = 'P10' THEN 10
            WHEN rs.position = 'P11' THEN 11
            WHEN rs.position = 'P12' THEN 12
            WHEN rs.position = 'P13' THEN 13
            WHEN rs.position = 'P14' THEN 14
            WHEN rs.position = 'P15' THEN 15
            WHEN rs.position = 'P16' THEN 16
            WHEN rs.position = 'P17' THEN 17
            WHEN rs.position = 'P18' THEN 18
            WHEN rs.position = 'P19' THEN 19
            WHEN rs.position = 'P20' THEN 20
            ELSE 21
            END
            ) AS avg_finish_position,
            COUNT(DISTINCT r.race_id) AS num_races
            FROM constructor c
            LEFT JOIN contract ct ON c.constructor_id = ct.constructor_id
            LEFT JOIN race_crew rc ON ct.crew_id = rc.crew_id
            LEFT JOIN driver_info d ON rc.crew_id = d.crew_id
            LEFT JOIN race_stats rs ON d.driver_code = rs.driver_code
            LEFT JOIN ref_points_awarded pa ON rs.position = pa.position
            LEFT JOIN race r ON rs.race_id = r.race_id AND r.race_season = ${season}
            WHERE c.constructor_id = ${constructor_id}
            GROUP BY c.constructor_id
            ORDER BY total_points DESC;`;
            const [rows] = await conn.query(query);

            if (rows.length === 0) {
                return { error: "Constructors cannot be retrieved" }
            }

            return rows[0];
        } catch (err) {
            console.log(err);
            return { error: "Constructors cannot be retrieved" }
        }
    }

    if (validateQuery(req, ['constructor_id', 'season'])) {
        const data = await performQuery(req.query.constructor_id, req.query.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/driver-championship', async (req, res) => {
    const performQuery = async (season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
                SELECT 	di.driver_code, CONCAT(rc.first_name, ', ', rc.last_name) AS full_name, c.name as team, ctry.name as country, SUM(pa.points) AS total_points
                FROM	driver_info di
                JOIN	race_stats rs ON di.driver_code = rs.driver_code
                JOIN    race r ON rs.race_id = r.race_id AND r.race_season = ${season}
                JOIN	REF_points_awarded pa ON rs.position = pa.position
                JOIN	REF_countries ctry ON di.country_id = ctry.country_id
                JOIN	race_crew rc ON di.crew_id = rc.crew_id
                JOIN	contract ct on rc.crew_id = ct.crew_id AND NOW() BETWEEN ct.contract_start AND ct.contract_end
                JOIN 	constructor c ON ct.constructor_id = c.constructor_id
                GROUP BY di.driver_code, ctry.name, c.constructor_id
                ORDER BY total_points DESC;`

            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            console.log(err);
            return { error: "Drivers cannot be retrieved!" }
        }
    }

    if (validateQuery(req, ['season'])) {
        const data = await performQuery(req.query.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/constructor-championship', async (req, res) => {
    const performQuery = async (season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            SELECT 	c.name, SUM(pa.points) AS total_points
            FROM	race_stats rs
            JOIN	race r ON rs.race_id = r.race_id AND race_season = ${season}
            JOIN	REF_points_awarded pa ON pa.position = rs.position
            JOIN	driver_info di ON rs.driver_code = di.driver_code
            JOIN	race_crew rc ON di.crew_id = rc.crew_id
            JOIN	contract ct on rc.crew_id = ct.crew_id AND NOW() BETWEEN ct.contract_start AND ct.contract_end
            JOIN 	constructor c ON ct.constructor_id = c.constructor_id
            GROUP BY c.constructor_id
            ORDER BY total_points DESC;`

            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Constructors championship cannot be retrieved!" }
        }
    }

    if (validateQuery(req, ['season'])) {
        const data = await performQuery(req.query.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

// Server loop basically
app.listen(port, () => {
    console.log(`FormulaDB is listening on port ${port} `)
})